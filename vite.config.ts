import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const supabaseUrl = env.SUPABASE_URL || '';
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';

  return {
    plugins: [
      react(),
      {
        name: 'local-dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res, next) => {
            if (req.method !== 'POST') return next();

            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              res.setHeader('Content-Type', 'application/json');

              const openRouterApiKey = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || '';
              const configuredModel = env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || 'google/gemma-4-31b-it:free';

              if (!openRouterApiKey) {
                res.statusCode = 503;
                res.end(
                  JSON.stringify({
                    error:
                      'AI assistant API key is not configured on the server. Please configure your API key in your server environment or Supabase secrets.',
                    code: 'MISSING_API_KEY',
                  })
                );
                return;
              }

              try {
                const body = JSON.parse(bodyStr || '{}');
                const { message, history, context } = body;

                if (!message || typeof message !== 'string' || !message.trim()) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: 'Message cannot be empty', code: 'EMPTY_MESSAGE' }));
                  return;
                }

                // Mask sensitive citizen PII
                const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
                const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;
                const cleanMessage = message
                  .trim()
                  .replace(aadhaarRegex, '[REDACTED_AADHAAR]')
                  .replace(panRegex, '[REDACTED_PAN]');

                let activeContextNote = '';
                if (context?.activeServiceName) {
                  activeContextNote = `\nCitizen is currently viewing: "${context.activeServiceName}" (Category: ${context.activeServiceCategory || 'General'}). Focus advice on this service where relevant.`;
                }

                const systemInstruction = `You are the SevaGuide AI Assistant (सेवागाइड), an official civic advisor helping Indian citizens understand and prepare for government services.
Explain document categories clearly (POI, POA, DOB, POR). Guide citizens through SevaGuide's 3-step workflow (Checklist -> Verification -> Submission).
For indexed services (Aadhaar, Passport, PAN, DL, CG Domicile/Caste/Pensions), provide accurate rules, fees, and official links.
NEVER invent fees or eligibility rules. If uncertain, advise visiting the nearest Lok Seva Kendra.
NEVER ask for personal Aadhaar numbers, PAN, or passwords. Never claim to have submitted applications.${activeContextNote}`;

                const messages = [
                  { role: 'system', content: systemInstruction },
                ];

                if (Array.isArray(history)) {
                  for (const turn of history.slice(-8)) {
                    if (turn.sender === 'user' && turn.text) {
                      messages.push({
                        role: 'user',
                        content: turn.text.replace(aadhaarRegex, '[REDACTED]').replace(panRegex, '[REDACTED]'),
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
                  content: cleanMessage,
                });

                const verifiedFreeModels = [
                  'google/gemma-4-31b-it:free',
                  'nvidia/nemotron-3.5-lightning:free',
                  'google/gemma-4-26b-a4b-it:free',
                  'openrouter/free',
                ];

                const candidateModels = Array.from(
                  new Set([configuredModel, ...verifiedFreeModels])
                ).filter((m) => m.endsWith(':free') || m === 'openrouter/free');

                const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

                let lastError = null;
                let anyDailyQuotaExhausted = false;

                for (const modelToTry of candidateModels) {
                  let attempts = 0;
                  const maxAttemptsPerModel = 2;

                  while (attempts < maxAttemptsPerModel) {
                    attempts++;

                    try {
                      const controller = new AbortController();
                      const timeoutId = setTimeout(() => controller.abort(), 12000);

                      const openRouterRes = await fetch(openRouterUrl, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${openRouterApiKey}`,
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

                      if (openRouterRes.ok) {
                        const openRouterData = await openRouterRes.json();
                        const reply = openRouterData.choices?.[0]?.message?.content || '';

                        if (reply) {
                          res.statusCode = 200;
                          res.end(JSON.stringify({ reply, model: openRouterData.model || modelToTry }));
                          return;
                        }
                      }

                      const retryAfterHeader = openRouterRes.headers.get('retry-after');
                      const errorData = await openRouterRes.json().catch(() => ({}));
                      const errObj = errorData?.error || errorData || {};
                      const errMsg = (errObj.message || '').toLowerCase();
                      const metadata = errObj.metadata || {};
                      const errorType = (metadata.error_type || '').toLowerCase();
                      const providerCode = metadata.provider_code;

                      let retryAfterSec = 0;
                      if (retryAfterHeader) {
                        const p = parseInt(retryAfterHeader, 10);
                        if (!isNaN(p) && p > 0) retryAfterSec = p;
                      }

                      const isDailyQuota =
                        errorType.includes('quota') ||
                        errorType.includes('daily') ||
                        errMsg.includes('daily limit') ||
                        errMsg.includes('free daily') ||
                        errMsg.includes('quota exceeded') ||
                        errMsg.includes('credit balance is too low') ||
                        errMsg.includes('insufficient quota');

                      const isThrottled =
                        openRouterRes.status === 429 ||
                        providerCode === 429 ||
                        errorType.includes('rate_limit') ||
                        errMsg.includes('rate limit') ||
                        errMsg.includes('too many requests');

                      lastError = {
                        isDailyQuota,
                        isThrottled,
                        message: (errObj.message || `Status ${openRouterRes.status}`).replace(/openrouter/gi, 'AI assistant'),
                      };

                      if (isDailyQuota) {
                        anyDailyQuotaExhausted = true;
                        break; // fallback to next free model
                      }

                      if (isThrottled && attempts < maxAttemptsPerModel) {
                        const delayMs = retryAfterSec > 0 && retryAfterSec <= 3
                          ? retryAfterSec * 1000
                          : Math.min(1000 * attempts, 2500);

                        await new Promise((r) => setTimeout(r, delayMs));
                        continue;
                      }

                      break; // proceed to next fallback free model
                    } catch (_err) {
                      lastError = { isDailyQuota: false, isThrottled: false, message: 'Request timeout or network failure reaching the AI service.' };
                      break;
                    }
                  }
                }

                if (anyDailyQuotaExhausted) {
                  res.statusCode = 429;
                  res.end(
                    JSON.stringify({
                      error:
                        'The free daily quota has been exhausted. Please try again tomorrow.',
                      code: 'DAILY_QUOTA_EXHAUSTED',
                    })
                  );
                  return;
                }

                if (lastError?.isThrottled) {
                  res.statusCode = 429;
                  res.end(
                    JSON.stringify({
                      error:
                        'The AI assistant is currently experiencing high traffic. Please wait a moment before trying again.',
                      code: 'RATE_LIMIT_EXHAUSTED',
                    })
                  );
                  return;
                }

                res.statusCode = 502;
                res.end(
                  JSON.stringify({
                    error:
                      lastError?.message ||
                      'AI assistant is temporarily unavailable. Please try again shortly.',
                    code: 'PROVIDERS_UNAVAILABLE',
                  })
                );
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message, code: 'INTERNAL_ERROR' }));
              }
            });
          });
        },
      },
    ],
    // Exposes variables starting with SUPABASE_ to import.meta.env
    envPrefix: ['SUPABASE_', 'VITE_'],
    define: {
      'import.meta.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
      'import.meta.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey),
    },
  };
});
