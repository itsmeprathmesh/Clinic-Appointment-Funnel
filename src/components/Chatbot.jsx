import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { CHAT_BOT_CORPUS } from '../utils/mockData';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your ClinicCapture Assistant. How can I help you today? You can ask me about insurance, cancellations, the waitlist, or clinic hours.", timestamp: new Date() }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // 1. Add User Message
    const userMsg = { sender: 'user', text: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // 2. Process Answer Contextually
    setTimeout(() => {
      const query = textToSend.toLowerCase();
      let matchedResponse = null;

      // Scan keyword corpus
      for (const faq of CHAT_BOT_CORPUS) {
        const hasMatch = faq.keywords.some(keyword => query.includes(keyword));
        if (hasMatch) {
          matchedResponse = faq.response;
          break;
        }
      }

      // Default fallback
      if (!matchedResponse) {
        matchedResponse = "I couldn't find a direct match for that query. You can ask me about: 'accepted insurance', 'free cancellation policy', 'how the waitlist works', 'clinic hours', or 'doctor qualifications'.";
      }

      // 3. Add Bot response
      setMessages(prev => [...prev, { sender: 'bot', text: matchedResponse, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1200); // 1.2s typing delay for realism
  };

  const quickReplies = [
    { label: "✓ Insurance Accepted", query: "What insurance do you accept?" },
    { label: "🗙 Cancellation Policy", query: "What is your cancellation policy?" },
    { label: "⏱ How Waitlist Works", query: "How does the waitlist work?" },
    { label: "📍 Location & Hours", query: "Where are you located and what are your hours?" }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 100 }}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 24px hsla(var(--primary), 0.4)',
            transition: 'transform var(--transition-fast), background-color var(--transition-fast)',
            animation: 'pulse 2.5s infinite ease-in-out'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title="Open FAQ Chatbot"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="glass-panel animate-slide-in-right" style={{
          width: '360px',
          height: '500px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--glass-border)'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: 'hsl(var(--primary))',
            color: '#fff',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '6px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Clinic Assistant</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', opacity: 0.9 }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#4ADE80', borderRadius: '50%' }} />
                  Context FAQ Engine Active
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'hsla(var(--background), 0.4)'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                  backgroundColor: msg.sender === 'user' ? 'hsl(var(--primary))' : 'hsl(var(--surface))',
                  color: msg.sender === 'user' ? '#fff' : 'hsl(var(--text))',
                  border: msg.sender === 'user' ? 'none' : '1px solid hsl(var(--border))',
                  boxShadow: 'var(--shadow-sm)',
                  borderRadius: msg.sender === 'user' 
                    ? '12px 12px 2px 12px' 
                    : '12px 12px 12px 2px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Simulated Typing Bubbles */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '12px 12px 12px 2px',
                  backgroundColor: 'hsl(var(--surface))',
                  border: '1px solid hsl(var(--border))',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="typing-dots">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies chips panel */}
          <div style={{
            padding: '8px 12px',
            borderTop: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--surface))',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px'
          }}>
            {quickReplies.map((qr, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qr.query)}
                style={{
                  border: '1px solid hsl(var(--border))',
                  background: 'none',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  color: 'hsl(var(--text-muted))',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                  backgroundColor: 'hsl(var(--background))'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                  e.currentTarget.style.color = 'hsl(var(--primary))';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'hsl(var(--border))';
                  e.currentTarget.style.color = 'hsl(var(--text-muted))';
                }}
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            style={{
              padding: '12px',
              borderTop: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--surface))',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              className="input"
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              placeholder="Ask about insurance or policy..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '38px',
                height: '38px',
                padding: 0,
                borderRadius: 'var(--radius-md)',
                flexShrink: 0,
                opacity: (!inputVal.trim() || isTyping) ? 0.6 : 1
              }}
              disabled={!inputVal.trim() || isTyping}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
