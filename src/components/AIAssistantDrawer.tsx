import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { askSevaGuide, AIContext } from '../services/ai';
import { ChatMessage } from '../types';

export const AIAssistantDrawer: React.FC<{ isOpen: boolean; onClose: () => void; context?: AIContext }> = ({ isOpen, onClose, context }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: '1', sender: 'assistant', text: `Hello! I'm SevaGuide AI. How can I help you today?`, timestamp: 'Just now' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: query, timestamp: 'Just now' }]);
    if (!textToSend) setInput('');
    setLoading(true);
    try {
      const aiReply = await askSevaGuide(query, context);
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'assistant', text: aiReply, timestamp: 'Just now' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-black shadow-2xl z-50 border-l border-slate-200 dark:border-zinc-800 flex flex-col transition-colors">
      <div className="p-4 bg-blue-900 dark:bg-zinc-950 text-white flex justify-between items-center border-b border-blue-950 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-200 dark:text-blue-400" />
          <h3 className="font-bold text-sm text-white">Ask SevaGuide AI</h3>
        </div>
        <button onClick={onClose} className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition" aria-label="Close Assistant">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-black text-xs">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
              m.sender === 'user'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-slate-200 shadow-xs'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span>Checking official guidelines...</span>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
        />
        <button
          onClick={() => handleSend()}
          className="bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white p-2 rounded-xl transition shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};