import { useState, useRef, useEffect } from 'react';
import { sendAIMessage } from '../services/api';

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: '👋 Namaste! I\'m Ajay, your personal fruit expert. How can I help you today? 🍎' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);

    try {
      const res = await sendAIMessage(msg, messages.map(m => ({ role: m.role, text: m.text })));
      setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I\'m having trouble connecting. Please try again! 🙏' }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = ['🏷️ Latest Prices', '📦 Track Order', '💰 Refund Policy', '🚚 Delivery Time'];

  return (
    <>
      {/* FAB Button */}
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 500,
        width: 56, height: 56, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        border: 'none', cursor: 'pointer', fontSize: '1.4rem',
        boxShadow: '0 8px 25px rgba(212,175,55,0.4)',
        transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: open ? 'rotate(45deg) scale(1.1)' : 'scale(1)'
      }}>
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '6rem', right: '2rem', zIndex: 500,
          width: 360, height: 520, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-card)', border: '1px solid var(--border-hover)',
          borderRadius: 'var(--radius-lg)', overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ padding: '1rem 1.2rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), transparent)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🍎</div>
            <div>
              <div style={{ fontWeight: 700 }}>Ajay AI</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: 'var(--success)', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
                Online & Ready
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '0.6rem 0.9rem',
                  borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'rgba(255,255,255,0.06)',
                  color: m.role === 'user' ? '#000' : 'var(--text)',
                  fontSize: '0.875rem', lineHeight: 1.5,
                  border: m.role === 'ai' ? '1px solid var(--border)' : 'none'
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '0.5rem' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: `pulse 1s ${i * 0.2}s infinite` }}></div>)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '0.5rem 0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)' }}>
            {quickActions.map(a => (
              <button key={a} onClick={() => send(a)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '50px', padding: '3px 10px', fontSize: '0.72rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {a}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); send(); }} style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border)' }}>
            <input
              className="input"
              placeholder="Type your query..."
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 0.9rem', fontSize: '0.875rem' }}
            />
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.6rem 0.9rem' }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}
