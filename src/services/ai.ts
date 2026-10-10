import { supabase } from '../lib/supabase';

export interface AIContext {
  activeServiceId?: string;
  activeServiceName?: string;
  activeServiceCategory?: string;
  currentStep?: string;
  verificationIssues?: string[];
}

export interface ChatHistoryItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: string;
}

export interface AIResponseResult {
  reply: string;
  model?: string;
  isError?: boolean;
  errorCode?: string;
  warningNote?: string;
}

// Client-side PII guard: never send Aadhaar numbers or PAN numbers
export function sanitizeCitizenInput(text: string): { cleanText: string; hasSensitiveData: boolean } {
  const aadhaarRegex = /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g;
  const panRegex = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi;

  const hasAadhaar = aadhaarRegex.test(text);
  const hasPan = panRegex.test(text);

  const cleanText = text
    .replace(aadhaarRegex, '[REDACTED_AADHAAR]')
    .replace(panRegex, '[REDACTED_PAN]');

  return {
    cleanText,
    hasSensitiveData: hasAadhaar || hasPan,
  };
}

/**
 * Sends a query to the SevaGuide AI backend.
 * Checks Supabase Edge Function first, falling back to serverless /api/chat.
 * Does not fabricate successful responses when the backend/API key is unavailable.
 */
export async function askSevaGuide(
  question: string,
  context?: AIContext,
  history?: ChatHistoryItem[]
): Promise<AIResponseResult> {
  const trimmed = question.trim();
  if (!trimmed) {
    return {
      reply: 'Please enter a question to ask the SevaGuide assistant.',
      isError: true,
      errorCode: 'EMPTY_INPUT',
    };
  }

  const { cleanText, hasSensitiveData } = sanitizeCitizenInput(trimmed);
  const privacyWarning = hasSensitiveData
    ? 'Notice: For your privacy and protection, your personal Aadhaar or PAN number was masked before transmission.'
    : undefined;

  const payload = {
    message: cleanText,
    context: {
      activeServiceId: context?.activeServiceId,
      activeServiceName: context?.activeServiceName,
      activeServiceCategory: context?.activeServiceCategory,
      currentStep: context?.currentStep,
      verificationIssues: context?.verificationIssues,
    },
    history: (history || []).slice(-8).map((h) => ({
      sender: h.sender,
      text: h.text,
    })),
  };

  // 1. Try Supabase Edge Function: 'chat'
  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: payload,
      });

      if (!error && data?.reply) {
        return {
          reply: data.reply,
          model: data.model || 'google/gemma-4-31b-it:free',
          warningNote: privacyWarning,
        };
      }

      // If Edge Function responded with structured missing API key or error
      if (data?.error) {
        return {
          reply: data.error,
          isError: true,
          errorCode: data.code || 'BACKEND_ERROR',
          warningNote: privacyWarning,
        };
      }
    } catch {
      // Supabase Edge Function invocation failed or not deployed; fallback to /api/chat
    }
  }

  // 2. Try server endpoint: /api/chat
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok && data?.reply) {
      return {
        reply: data.reply,
        model: data.model || 'google/gemma-4-31b-it:free',
        warningNote: privacyWarning,
      };
    }

    if (data?.error) {
      return {
        reply: data.error,
        isError: true,
        errorCode: data.code || 'API_ERROR',
        warningNote: privacyWarning,
      };
    }

    return {
      reply: `AI assistant backend error (HTTP ${res.status}). Please verify that your backend endpoint is reachable.`,
      isError: true,
      errorCode: `HTTP_${res.status}`,
      warningNote: privacyWarning,
    };
  } catch (err: any) {
    return {
      reply:
        'Unable to connect to the AI assistant backend. Please verify your internet connection or server configuration.',
      isError: true,
      errorCode: 'NETWORK_FAILURE',
      warningNote: privacyWarning,
    };
  }
}