import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendOTP, verifyOTP } from '../services/api';
import toast from 'react-hot-toast';

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // phone | otp | register
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugOtp, setDebugOtp] = useState(null);

  const handleSendOTP = async () => {
    if (phone.length < 10) return toast.error('Enter valid 10-digit phone number');
    setLoading(true);
    try {
      const res = await sendOTP(phone);
      if (res.data.debug_otp) setDebugOtp(res.data.debug_otp); // Dev mode
      toast.success('OTP sent!');
      setStep('otp');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');
    setLoading(true);
    try {
      const res = await verifyOTP({ phone, otp, name, address });
      login(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}! 🍎`);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>
              {step === 'phone' ? '👋 Welcome' : step === 'otp' ? '📱 Verify OTP' : '✨ Almost Done'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {step === 'phone' ? 'Enter your phone number' : step === 'otp' ? `Code sent to ${phone}` : 'Tell us your name'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>

        {step === 'phone' && (
          <div>
            <label className="input-label">Phone Number</label>
            <input className="input" type="tel" placeholder="10-digit mobile number" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} style={{ marginBottom: '1rem' }} />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSendOTP} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP →'}
            </button>
          </div>
        )}

        {step === 'otp' && (
          <div>
            {debugOtp && (
              <div style={{ background: 'rgba(217,70,239,0.1)', border: '1px solid rgba(217,70,239,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', color: '#d946ef' }}>
                🔧 Dev Mode — Your OTP: <strong style={{ fontSize: '1.1rem', letterSpacing: '4px' }}>{debugOtp}</strong>
              </div>
            )}
            <label className="input-label">Your Name (optional)</label>
            <input className="input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: '0.75rem' }} />
            <label className="input-label">Delivery Address (optional)</label>
            <input className="input" placeholder="Your address" value={address} onChange={e => setAddress(e.target.value)} style={{ marginBottom: '0.75rem' }} />
            <label className="input-label">OTP Code</label>
            <input className="input" type="text" placeholder="6-digit OTP" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              style={{ marginBottom: '1rem', textAlign: 'center', letterSpacing: '8px', fontSize: '1.4rem', fontWeight: 700 }} />
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleVerifyOTP} disabled={loading}>
              {loading ? 'Verifying...' : '✅ Verify & Login'}
            </button>
            <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => setStep('phone')}>← Change number</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
