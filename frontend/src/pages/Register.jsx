import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../store/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) setSuccess(true);
  };

  const inputStyle = {
    width: '100%', border: '1.5px solid #e8e3f5', borderRadius: '10px',
    padding: '11px 14px', fontSize: '14px', color: '#1a1040', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box',
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f5ff 0%, #ede8ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />
      <div style={{ background: 'white', borderRadius: '24px', padding: '3rem', textAlign: 'center', maxWidth: '400px', boxShadow: '0 24px 60px rgba(83,74,183,0.15)' }}>
        <div style={{ width: '64px', height: '64px', background: '#f0ecff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2"><path d="M22 6L12 13 2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
        </div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '500', color: '#1a1040', marginBottom: '8px' }}>Check your inbox</h2>
        <p style={{ fontSize: '14px', color: '#8b7fb8', lineHeight: '1.6', fontWeight: '300' }}>
          We sent a verification link to <strong style={{ color: '#3d3060', fontWeight: '600' }}>{form.email}</strong>
        </p>
        <Link to="/login" style={{ display: 'inline-block', marginTop: '1.5rem', color: '#6C5CE7', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Back to sign in</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8f5ff 0%, #ede8ff 50%, #f3f0ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", padding: '1.5rem' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: '460px', background: 'white', borderRadius: '24px', padding: '2.75rem', boxShadow: '0 32px 80px rgba(83,74,183,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: '600', color: '#1a1040' }}>SkillSphere</span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: '500', color: '#1a1040', marginBottom: '6px', letterSpacing: '-0.3px' }}>Create your account</h1>
        <p style={{ fontSize: '14px', color: '#8b7fb8', marginBottom: '2rem', fontWeight: '300' }}>Join thousands of professionals on SkillSphere</p>

        {error && <div style={{ background: '#fdf2f8', border: '1px solid #e9b8d8', color: '#8b1a5a', padding: '12px 16px', borderRadius: '10px', fontSize: '14px', marginBottom: '1.25rem' }}>{error}</div>}

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '13px', fontWeight: '500', color: '#3d3060', marginBottom: '10px' }}>I am joining as a...</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[['client','🏢','Client','Post projects & hire'],['freelancer','💼','Freelancer','Find work & get paid']].map(([role, icon, label, desc]) => (
              <button key={role} type="button" onClick={() => setForm({ ...form, role })} style={{
                padding: '14px 12px', borderRadius: '12px', border: `2px solid ${form.role === role ? '#6C5CE7' : '#e8e3f5'}`,
                background: form.role === role ? '#f5f2ff' : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: form.role === role ? '#6C5CE7' : '#3d3060' }}>{label}</div>
                <div style={{ fontSize: '11px', color: '#a090c0', marginTop: '2px', fontWeight: '300' }}>{desc}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {[['name','text','Full name','e.g. Priya Sharma'],['email','email','Email address','you@example.com'],['password','password','Password','min. 6 characters']].map(([field, type, label, ph]) => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#3d3060', marginBottom: '6px' }}>{label}</label>
              <input type={type} required placeholder={ph} value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor='#6C5CE7'}
                onBlur={e => e.target.style.borderColor='#e8e3f5'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#b3acdd' : 'linear-gradient(135deg, #6C5CE7 0%, #4834C5 100%)',
            color: 'white', border: 'none', borderRadius: '12px', padding: '13px', marginTop: '0.5rem',
            fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.2px',
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#8b7fb8', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C5CE7', textDecoration: 'none', fontWeight: '600' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
