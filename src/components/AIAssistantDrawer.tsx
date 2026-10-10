import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  X,
  Send,
  Sparkles,
  Minimize2,
  Maximize2,
  Trash2,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Check,
  Copy,
  Info
} from 'lucide-react';
import { askSevaGuide, AIContext } from '../services/ai';
import { ChatMessage } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  context?: AIContext;
}

const DEFAULT_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  sender: 'assistant',
  text: `Namaste! I am the **SevaGuide AI Assistant**.

I can help you with:
- Explaining **POI**, **POA**, and **DOB** proof categories
- Eligibility and step-by-step checklists for Central & Chhattisgarh services
- Directing you to authorized portals and nearby Seva Kendras
- Resolving documentation discrepancies (spelling, address layouts)

How may I assist your civic journey today?`,
  timestamp: 'Just now',
};

const SUGGESTED_QUESTIONS = [
  'What documents are accepted for Proof of Address (POA)?',
  'What do I need for New Aadhaar Enrolment?',
  'How to fix name mismatch between PAN and Aadhaar?',
  'What is required for Chhattisgarh Domicile Certificate?',
  'How much is the fee for Aadhaar update?',
];

// Session storage key to preserve conversation history during the session
const CHAT_STORAGE_KEY = 'sevaguide_chat_history_v1';

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onOpen,
  context,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [DEFAULT_WELCOME_MESSAGE];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);

  const isSubmittingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Sync to session storage whenever messages change
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive or loading status changes
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    if (isSubmittingRef.current || loading) return;

    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query) return;

    isSubmittingRef.current = true;
    setLoading(true);

    const userMsgId = Date.now().toString();
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === undefined) {
      setInput('');
    }
    setLastFailedQuery(null);

    try {
      const response = await askSevaGuide(query, context, messages);
      const assistantMsgId = (Date.now() + 1).toString();

      const assistantMessage: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: response.isError,
        errorCode: response.errorCode,
        model: response.model,
        warningNote: response.warningNote,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.isError) {
        setLastFailedQuery(query);
      }
    } catch (err: any) {
      const errorMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: errorMsgId,
          sender: 'assistant',
          text: 'Unable to connect to the AI assistant. Please check your network or server configuration.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
          errorCode: 'NETWORK_ERROR',
        },
      ]);
      setLastFailedQuery(query);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your conversation history with SevaGuide AI?')) {
      const reset = [DEFAULT_WELCOME_MESSAGE];
      setMessages(reset);
      try {
        sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(reset));
      } catch {
        // ignore
      }
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setIsMinimized(true);
    }
  };

  // Safe markdown-like text renderer
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Bullet list items
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="flex-1">{renderInlineTokens(content)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineTokens(line)}</p>;
        })}
      </div>
    );
  };

  // Parses bold, code, and markdown links
  const renderInlineTokens = (content: string) => {
    // Regex matches [link text](url), **bold**, `code`
    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        elements.push(content.substring(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // Markdown link [text](url)
        const label = match[2];
        const url = match[3];
        const isInternal = url.startsWith('/');

        if (isInternal) {
          elements.push(
            <Link
              key={match.index}
              to={url}
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>{label}</span>
            </Link>
          );
        } else {
          elements.push(
            <a
              key={match.index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>{label}</span>
              <ExternalLink className="w-3 h-3 inline-block opacity-75" />
            </a>
          );
        }
      } else if (match[4]) {
        // Bold **text**
        elements.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-white">
            {match[4]}
          </strong>
        );
      } else if (match[5]) {
        // Inline `code`
        elements.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-[11px] font-mono text-blue-700 dark:text-blue-300"
          >
            {match[5]}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }

    return elements;
  };

  // ---------------------------------------------------------------------------
  // 1. FLOATING CHATBOT LAUNCHER BUBBLE (When closed or minimized)
  // ---------------------------------------------------------------------------
  if (!isOpen) {
    return (
      <div
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 flex items-center"
        aria-label="Floating SevaGuide AI Chatbot"
      >
        <button
          type="button"
          onClick={() => {
            setIsMinimized(false);
            if (onOpen) onOpen();
          }}
          title="Open SevaGuide AI Assistant"
          className="group relative w-14 h-14 rounded-full bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-2xl hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400 cursor-pointer active:scale-95 hover:scale-105"
          aria-label="Open SevaGuide AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-blue-700 dark:ring-blue-600 animate-pulse" />
          </div>
          <span className="sr-only">Open SevaGuide AI Assistant</span>
        </button>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. MINIMIZED STATE PILL (When open but minimized)
  // ---------------------------------------------------------------------------
  if (isMinimized) {
    return (
      <div
        className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 flex items-center shadow-2xl rounded-2xl"
        role="region"
        aria-label="Minimized AI Assistant"
      >
        <div className="bg-slate-900/95 dark:bg-zinc-950/95 backdrop-blur-md text-white border border-slate-700 dark:border-zinc-800 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-xl">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-xs font-semibold text-white hover:text-blue-300 transition cursor-pointer"
            aria-label="Restore chat window"
          >
            <Bot className="w-4 h-4 text-blue-400" />
            <span>SevaGuide AI Assistant</span>
            <Maximize2 className="w-3.5 h-3.5 ml-1 text-slate-400" />
          </button>
          <div className="h-4 w-px bg-slate-700 dark:bg-zinc-800" />
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. FULL FLOATING CHAT PANEL (Bottom-Right, non-overlapping with toolbar)
  // ---------------------------------------------------------------------------
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="SevaGuide AI Assistant"
      className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[550px] max-h-[85vh] bg-white dark:bg-zinc-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* ---------------- HEADER ---------------- */}
      <div className="px-4 py-3.5 bg-slate-900 dark:bg-black text-white flex justify-between items-center border-b border-slate-800 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs sm:text-sm text-white leading-none">
                SevaGuide AI Assistant
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>Civic Assistant • AI Guidance</span>
            </p>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1">
          {/* Clear conversation */}
          <button
            type="button"
            onClick={handleClearHistory}
            title="Clear conversation history"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Clear chat conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Minimize */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            title="Minimize chat"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Minimize chat window"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            title="Close assistant"
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
            aria-label="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ---------------- ACTIVE SERVICE CONTEXT BANNER (If present) ---------------- */}
      {context?.activeServiceName && (
        <div className="bg-blue-50 dark:bg-blue-950/70 px-3.5 py-1.5 border-b border-blue-100 dark:border-blue-900/60 flex items-center justify-between text-[11px] text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-1.5 truncate">
            <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">Context: <strong>{context.activeServiceName}</strong></span>
          </div>
        </div>
      )}

      {/* ---------------- MESSAGES CONTAINER ---------------- */}
      <div
        className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 dark:bg-black/60 text-xs"
        aria-live="polite"
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';

          return (
            <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
              <div
                className={`max-w-[88%] rounded-2xl p-3 sm:p-3.5 transition-all shadow-xs ${
                  isUser
                    ? 'bg-blue-700 dark:bg-blue-600 text-white rounded-br-xs shadow-blue-900/20'
                    : m.isError
                    ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 rounded-bl-xs'
                    : 'bg-white dark:bg-zinc-900 border border-slate-200/90 dark:border-zinc-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                {/* Privacy Warning Note if user input was scrubbed */}
                {m.warningNote && (
                  <div className="mb-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-[11px] text-amber-800 dark:text-amber-200 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{m.warningNote}</span>
                  </div>
                )}

                {/* Error Banner for Missing API Key or Network failure */}
                {m.isError && (
                  <div className="mb-2 flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Backend Notice ({m.errorCode || 'ERROR'})</span>
                  </div>
                )}

                {/* Message Content */}
                <div className="text-[12px] leading-relaxed break-words">
                  {renderFormattedText(m.text)}
                </div>

                {/* Structured error instructions if missing API key */}
                {m.isError && m.errorCode === 'MISSING_API_KEY' && (
                  <div className="mt-2.5 pt-2 border-t border-rose-200 dark:border-rose-900/60 text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">Configuration Required:</p>
                    <p>The AI assistant API key has not been configured in server environment variables or backend secrets.</p>
                  </div>
                )}

                {/* Structured error notice for daily free quota exhaustion */}
                {m.isError && m.errorCode === 'DAILY_QUOTA_EXHAUSTED' && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Daily Free Quota Exhausted</span>
                    </p>
                    <p className="leading-relaxed">
                      The daily free query limit has been reached. A short wait will not reset this quota. Please try again tomorrow.
                    </p>
                  </div>
                )}

                {/* Structured error notice for temporary concurrency throttling */}
                {m.isError && m.errorCode === 'RATE_LIMIT_EXHAUSTED' && (
                  <div className="mt-2 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                    <p>Free AI providers are currently busy. Please wait a few moments before trying again.</p>
                  </div>
                )}

                {/* Message Footer (Timestamp & Copy button) */}
                <div className="mt-2 flex items-center justify-between gap-2 text-[10px] opacity-75">
                  <span>{m.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(m.id, m.text)}
                        title="Copy answer"
                        className="p-1 hover:opacity-100 transition rounded hover:bg-black/5 dark:hover:bg-white/10"
                        aria-label="Copy message text"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>

                      {/* Retry only available for transient errors, not daily quota or missing API key */}
                      {m.isError && lastFailedQuery && m.errorCode !== 'DAILY_QUOTA_EXHAUSTED' && m.errorCode !== 'MISSING_API_KEY' && (
                        <button
                          type="button"
                          onClick={() => handleSend(lastFailedQuery)}
                          disabled={loading}
                          title="Retry query"
                          className="p-1 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 disabled:opacity-50 cursor-pointer"
                          aria-label="Retry query"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl rounded-bl-xs p-3 shadow-xs flex items-center gap-2 text-slate-600 dark:text-slate-300 text-xs">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" />
              <span>Consulting official civic guidelines...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ---------------- SUGGESTED QUESTION CHIPS (When starting or only welcome msg) ---------------- */}
      {messages.length <= 2 && (
        <div className="px-3.5 py-2 bg-slate-100/90 dark:bg-zinc-900/80 border-t border-slate-200/80 dark:border-zinc-800 shrink-0">
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Suggested Queries
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] text-left bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 px-2.5 py-1 rounded-lg transition shadow-2xs cursor-pointer disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- INPUT AREA ---------------- */}
      <div className="p-3 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800 shrink-0 space-y-1.5">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder="Ask about documents, fees, or steps... (Enter to send)"
            aria-label="Type your message to SevaGuide AI"
            maxLength={1000}
            className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 resize-none transition"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-2xl transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shrink-0 cursor-pointer"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Security and privacy footer note */}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center flex items-center justify-center gap-1">
          <span>🔒 Never share personal Aadhaar numbers, OTPs, or passwords.</span>
        </p>
      </div>
    </div>
  );
};