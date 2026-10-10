// Vercel Serverless Function: /api/chat
// Server-side handler for OpenRouter Chat Completions API with rate-limit and fallback handling

function scrubSensitivePII(text: string): string {
  if (!text) return "";
  const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
  const phoneRegex = /\b(?:\+91|91)?[6-9]\d{9}\b/g;

  return text
    .replace(aadhaarRegex, "[REDACTED_AADHAAR]")
    .replace(panRegex, "[REDACTED_PAN]")
    .replace(phoneRegex, "[REDACTED_PHONE]");
}

const SEVAGUIDE_SYSTEM_PROMPT = `You are the SevaGuide AI Assistant (सेवागाइड), an official civic advisor helping Indian citizens understand and prepare for government services.

Your primary mission:
1. Explain document categories clearly:
   - POI (Proof of Identity): E.g., Voter ID, Passport, PAN Card, Driving Licence, Govt Photo ID.
   - POA (Proof of Address): E.g., Passport, Electricity Bill (<3 months old), Water Bill, Bank Passbook with address.
   - DOB (Proof of Date of Birth): E.g., Birth Certificate, 10th Standard Marksheet, Passport, PAN Card.
   - POR (Proof of Relationship): E.g., Birth Certificate, Ration Card, PDS Card with family head.

2. Guide citizens through SevaGuide's 3-step workflow:
   - Step 1: Pre-submission Checklist (Confirming physical papers vs conditional items).
   - Step 2: Verification & Consistency Check (Checking for name spelling and DOB discrepancies).
   - Step 3: Submission Mode (Applying via official online portals vs visiting a local Seva Kendra).

3. Provide accurate information for indexed services:
   - Central Services:
     * New Aadhaar Enrolment: Free of charge, 15-30 days, in-person biometric capture at ASK/bank/post office. Official portal: https://uidai.gov.in.
     * Aadhaar Update: ₹50 for demographic (name, address, DOB), ₹100 for biometric. Official portal: https://uidai.gov.in.
     * Fresh Indian Passport: Normal fee ₹1,500 (36 pages), Tatkaal ₹3,500. Processing 10-30 days. Non-ECR status requires 10th pass certificate. Official portal: https://passportindia.gov.in.
     * PAN Card Correction/Reprint: Physical delivery ₹50 in India. Official portal: https://onlineservices.nsdl.com.
     * Driving Licence (LL & DL): Parivahan portal: https://parivahan.gov.in.
   - Chhattisgarh State Services:
     * Domicile Certificate (निवास प्रमाण पत्र): 15+ years residency proof, revenue records, patwari/parshad certificate. Official portal: https://edistrict.cgstate.gov.in.
     * Caste Certificate (SC/ST/OBC): Historical land records, 1950/1984 record proofs, vanshavali (family tree). Official portal: https://edistrict.cgstate.gov.in.
     * Social Pensions (IGNOAPS, IGNWPS, IGNDPS): BPL cardholders, 60+ for IGNOAPS, widow 40+ for IGNWPS, 80%+ disability for IGNDPS.

4. Guidelines for tone and safety:
   - Be concise, supportive, and respectful.
   - Format responses with bullet points, bold key terms, and markdown links where helpful.
   - Suggest relevant SevaGuide internal routes: "/services" (all services), "/offices" (kendra locator), or service links.
   - NEVER invent government fees, eligibility requirements, or laws. If uncertain, explicitly state: "Please verify with the official facilitation officer at your nearest Lok Seva Kendra."
   - NEVER claim that you have submitted the citizen's application or officially verified their identity.
   - NEVER ask users for personal Aadhaar numbers, PAN numbers, OTPs, or financial credentials.`;

const VERIFIED_FREE_MODELS = [
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-26b-a4b-it:free",
  "openrouter/free",
];

interface ErrorAnalysis {
  isDailyQuota: boolean;
  isThrottled: boolean;
  isProviderUnavailable: boolean;
  retryAfterSec: number;
  message: string;
}

function analyzeError(status: number, errorData: any, retryAfterHeader?: string | null): ErrorAnalysis {
  const err = errorData?.error || errorData || {};
  const msg = (err.message || "").toLowerCase();
  const metadata = err.metadata || {};
  const errorType = (metadata.error_type || "").toLowerCase();
  const providerCode = metadata.provider_code;

  let retryAfterSec = 0;
  if (retryAfterHeader) {
    const parsed = parseInt(retryAfterHeader, 10);
    if (!isNaN(parsed) && parsed > 0) {
      retryAfterSec = parsed;
    }
  }

  const isDailyQuota =
    errorType.includes("quota") ||
    errorType.includes("daily") ||
    msg.includes("daily limit") ||
    msg.includes("free daily") ||
    msg.includes("quota exceeded") ||
    msg.includes("credit balance is too low") ||
    msg.includes("insufficient quota");

  const isThrottled =
    status === 429 ||
    providerCode === 429 ||
    errorType.includes("rate_limit") ||
    msg.includes("rate limit") ||
    msg.includes("too many requests");

  const isProviderUnavailable =
    status === 502 ||
    status === 503 ||
    status === 504 ||
    providerCode === 502 ||
    providerCode === 503 ||
    msg.includes("overloaded") ||
    msg.includes("unavailable") ||
    msg.includes("busy");

  return {
    isDailyQuota,
    isThrottled,
    isProviderUnavailable,
    retryAfterSec,
    message: (err.message || `Provider responded with HTTP ${status}`).replace(/openrouter/gi, 'AI assistant'),
  };
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const configuredModel = process.env.OPENROUTER_MODEL || VERIFIED_FREE_MODELS[0];

  if (!apiKey) {
    return res.status(503).json({
      error:
        'AI assistant API key is not configured on the server. Please configure your API key in server environment variables or backend secrets.',
      code: 'MISSING_API_KEY',
    });
  }

  try {
    const { message, history, context } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty', code: 'EMPTY_MESSAGE' });
    }

    if (message.length > 3000) {
      return res.status(400).json({ error: 'Message exceeds 3000 character limit', code: 'MESSAGE_TOO_LONG' });
    }

    const cleanUserMessage = scrubSensitivePII(message.trim());

    let activeContextNote = '';
    if (context?.activeServiceName) {
      activeContextNote = `\nCitizen is currently viewing: "${context.activeServiceName}" (Category: ${context.activeServiceCategory || 'General'}). Focus advice on this service where relevant.`;
    }

    const systemInstruction = SEVAGUIDE_SYSTEM_PROMPT + activeContextNote;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemInstruction },
    ];

    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const turn of recentHistory) {
        if (turn.sender === 'user' && turn.text) {
          messages.push({
            role: 'user',
            content: scrubSensitivePII(turn.text),
          });
        } else if (turn.sender === 'assistant' && turn.text) {
          messages.push({
            role: 'assistant',
            content: turn.text,
          });
        }
      }
    }

    messages.push({
      role: 'user',
      content: cleanUserMessage,
    });

    const candidateModels = Array.from(
      new Set([configuredModel, ...VERIFIED_FREE_MODELS])
    ).filter((m) => m.endsWith(':free') || m === 'openrouter/free');

    const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

    let lastError: ErrorAnalysis | null = null;
    let anyDailyQuotaExhausted = false;

    for (const modelToTry of candidateModels) {
      let attempts = 0;
      const maxAttemptsPerModel = 2;

      while (attempts < maxAttemptsPerModel) {
        attempts++;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000);

          const openRouterResponse = await fetch(openRouterUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'https://sevaguide.gov.in',
              'X-Title': 'SevaGuide AI Assistant',
            },
            body: JSON.stringify({
              model: modelToTry,
              messages,
              temperature: 0.3,
              max_tokens: 1024,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (openRouterResponse.ok) {
            const data = await openRouterResponse.json();
            const candidate = data.choices?.[0];
            const replyText = candidate?.message?.content;

            if (replyText) {
              return res.status(200).json({
                reply: replyText,
                model: data.model || modelToTry,
              });
            }
          }

          const retryAfterHeader = openRouterResponse.headers.get('retry-after');
          const errorData = await openRouterResponse.json().catch(() => ({}));
          const analysis = analyzeError(openRouterResponse.status, errorData, retryAfterHeader);
          lastError = analysis;

          if (analysis.isDailyQuota) {
            anyDailyQuotaExhausted = true;
            break; // switch to next fallback free model
          }

          if (analysis.isThrottled && attempts < maxAttemptsPerModel) {
            const delayMs = analysis.retryAfterSec > 0 && analysis.retryAfterSec <= 3
              ? analysis.retryAfterSec * 1000
              : Math.min(1000 * attempts, 2500);

            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }

          break; // proceed to next fallback free model
        } catch (_err) {
          lastError = {
            isDailyQuota: false,
            isThrottled: false,
            isProviderUnavailable: true,
            retryAfterSec: 0,
            message: 'Request timeout or network failure reaching the AI service.',
          };
          break;
        }
      }
    }

    if (anyDailyQuotaExhausted) {
      return res.status(429).json({
        error:
          'The free daily quota has been exhausted. Please try again tomorrow.',
        code: 'DAILY_QUOTA_EXHAUSTED',
      });
    }

    if (lastError?.isThrottled) {
      return res.status(429).json({
        error:
          'The AI assistant is currently experiencing high traffic. Please wait a moment before trying again.',
        code: 'RATE_LIMIT_EXHAUSTED',
      });
    }

    return res.status(502).json({
      error:
        lastError?.message ||
        'AI assistant is temporarily unavailable. Please try again shortly.',
      code: 'PROVIDERS_UNAVAILABLE',
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || 'An unexpected error occurred processing your request',
      code: 'INTERNAL_ERROR',
    });
  }
}
