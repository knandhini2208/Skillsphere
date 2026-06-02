import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../store/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f5ff 0%, #ede8ff 50%, #f3f0ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '1.5rem',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />

      <div style={{ display: 'flex', width: '100%', maxWidth: '900px', minHeight: '580px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(83,74,183,0.18)' }}>

        {/* Left Panel */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(160deg, #6C5CE7 0%, #4834C5 60%, #36259e 100%)',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: '600', letterSpacing: '-0.3px' }}>SkillSphere</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '500', lineHeight: '1.3', marginBottom: '1rem', color: 'white' }}>
              Connect with top local talent
            </h2>
            <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)', fontWeight: '300' }}>
              An AI-powered ecosystem matching clients with verified freelancers in your city.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[['2.4k+','Verified Freelancers'],['98%','Job Success Rate'],['₹12Cr+','Paid Out'],['50+','Cities Covered']].map(([n,l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 16px' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600', color: 'white' }}>{n}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px', fontWeight: '300' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ flex: '1', background: 'white', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '500', color: '#1a1040', marginBottom: '6px', letterSpacing: '-0.5px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: '#8b7fb8', marginBottom: '2rem', fontWeight: '300' }}>
            Sign in to your account to continue
          </p>

          {error && (
            <div style={{ background: '#fdf2f8', border: '1px solid #e9b8d8', color: '#8b1a5a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          <a href="/api/auth/google" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            border: '1.5px solid #e8e3f5', borderRadius: '12px', padding: '12px',
            fontSize: '14px', fontWeight: '500', color: '#3d3060', textDecoration: 'none',
            marginBottom: '1.5rem', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#ede8f5' }} />
            <span style={{ fontSize: '12px', color: '#b0a0cc', fontWeight: '400' }}>or sign in with email</span>
            <div style={{ flex: 1, height: '1px', background: '#ede8f5' }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#3d3060', marginBottom: '6px', letterSpacing: '0.1px' }}>Email address</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={{ width: '100%', border: '1.5px solid #e8e3f5', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: '#1a1040', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='#6C5CE7'}
                onBlur={e => e.target.style.borderColor='#e8e3f5'}
              />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#3d3060', marginBottom: '6px' }}>Password</label>
              <input type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{ width: '100%', border: '1.5px solid #e8e3f5', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', color: '#1a1040', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor='#6C5CE7'}
                onBlur={e => e.target.style.borderColor='#e8e3f5'}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <Link to="/forgot-password" style={{ fontSize: '13px', color: '#6C5CE7', textDecoration: 'none', fontWeight: '500' }}>Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#b3acdd' : 'linear-gradient(135deg, #6C5CE7 0%, #4834C5 100%)',
              color: 'white', border: 'none', borderRadius: '12px', padding: '13px',
              fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.2px', transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#8b7fb8', marginTop: '1.5rem' }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#6C5CE7', textDecoration: 'none', fontWeight: '600' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
