import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'http://localhost:3001';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "👋 Hi there! I'm the **Absolute Consultancy AI Assistant**.\n\nI can help you with:\n- 🎓 University admissions & shortlisting\n- 🛂 Visa application guidance\n- ✍️ SOP & essay writing tips\n- 💰 Scholarship opportunities\n- 🏠 Accommodation support\n\nHow can I help you today?",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(`${CHAT_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429 || data.error === 'rate_limit') {
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content:
              data.message ||
              data.reply ||
              "I'm currently at capacity. Please try again shortly, or reach us on WhatsApp at +60 17-563 1621 for immediate help. 🙏",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          return;
        }
        throw new Error(data.message || data.error || `Server error: ${res.status}`);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.offline) {
        setError(null);
      }
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError && /fetch|network|failed/i.test(err.message);
      const fallbackContent =
        "I'm currently offline while my AI brain is being upgraded. For immediate help, please reach our team on WhatsApp at +60 17-563 1621 — they're available 7 days a week and respond fast. 🙏";

      if (isNetworkError) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setError(null);
      } else {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: fallbackContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setError(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, []);

  const formatContent = useCallback((content: string) => {
    return content.split('\n').map((line, i) => {
      let formatted = line;
      formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-kimono font-semibold">$1</strong>');
      formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
          {i < content.split('\n').length - 1 && <br />}
        </span>
      );
    });
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center shadow-gold-lg transition-all duration-300 hover:scale-110 cursor-pointer"
        style={{
          background: isOpen
            ? 'rgba(201, 162, 52, 0.9)'
            : 'linear-gradient(135deg, #C9A234, #D4F87A)',
          border: '2px solid rgba(201, 162, 52, 0.6)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      <div
        className="fixed bottom-[168px] right-6 z-[100] w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.96)',
          pointerEvents: isOpen ? 'all' : 'none',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          className="rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: '520px',
            maxHeight: 'calc(100vh - 140px)',
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(201, 162, 52, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 162, 52, 0.08)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 shrink-0"
            style={{
              background: 'linear-gradient(135deg, rgba(11, 42, 92, 0.8), rgba(10, 10, 10, 0.9))',
              borderBottom: '1px solid rgba(201, 162, 52, 0.2)',
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, #C9A234, #D4F87A)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M12 22a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v0" />
                <rect x="4" y="8" width="16" height="12" rx="3" />
                <path d="M8 12h.01" />
                <path d="M16 12h.01" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-kimono text-sm tracking-wide">AI Assistant</h3>
              <p className="text-[10px] text-gold small-caps tracking-widest">Absolute Consultancy</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-[10px] text-mouse">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,162,52,0.3) transparent' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, rgba(201, 162, 52, 0.8), rgba(201, 162, 52, 0.6))'
                        : 'rgba(255, 255, 255, 0.06)',
                    color: msg.role === 'user' ? '#0A0A0A' : '#D5D5D5',
                    border:
                      msg.role === 'assistant'
                        ? '1px solid rgba(201, 162, 52, 0.15)'
                        : 'none',
                    borderBottomRightRadius: msg.role === 'user' ? '6px' : '16px',
                    borderBottomLeftRadius: msg.role === 'assistant' ? '6px' : '16px',
                  }}
                >
                  <div className="break-words">{formatContent(msg.content)}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl px-4 py-3 text-[13px] text-mouse"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(201, 162, 52, 0.15)',
                    borderBottomLeftRadius: '6px',
                  }}
                >
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-center">
                <div
                  className="rounded-xl px-4 py-2 text-[12px] text-red-400"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                  }}
                >
                  ⚠️ {error}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {[
                '🎓 University admissions',
                '🛂 Visa process',
                '💰 Scholarships',
                '📋 Requirements',
              ].map((label) => (
                <button
                  key={label}
                  onClick={() => {
                    setInput(label.replace(/^[^\s]+\s/, ''));
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer hover:scale-105"
                  style={{
                    background: 'rgba(201, 162, 52, 0.1)',
                    border: '1px solid rgba(201, 162, 52, 0.25)',
                    color: '#C9A234',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderTop: '1px solid rgba(201, 162, 52, 0.15)' }}
          >
            <div className="flex items-end gap-2">
              <div
                className="flex-1 rounded-xl overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(201, 162, 52, 0.2)',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full bg-transparent text-kimono text-[13px] px-3 py-2.5 resize-none outline-none placeholder:text-mouse/60"
                  style={{ maxHeight: '80px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105"
                style={{
                  background: input.trim()
                    ? 'linear-gradient(135deg, #C9A234, #D4F87A)'
                    : 'rgba(255, 255, 255, 0.05)',
                }}
                aria-label="Send message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={input.trim() ? '#0A0A0A' : '#888'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-mouse/50 text-center mt-2 small-caps tracking-widest">
              Powered by Gemini AI · Free Consultation: +60 17-563 1621
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
