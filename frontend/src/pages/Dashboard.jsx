import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const StatCard = ({ label, value, icon, trend, color = '#6C5CE7' }) => (
  <div style={{ background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #ede8f5', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <span style={{ fontSize: '13px', color: '#8b7fb8', fontWeight: '500', letterSpacing: '0.1px' }}>{label}</span>
      <span style={{ fontSize: '20px' }}>{icon}</span>
    </div>
    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '600', color: '#1a1040', letterSpacing: '-1px' }}>{value}</div>
    {trend && <div style={{ fontSize: '12px', color: '#2ecc71', marginTop: '4px', fontWeight: '500' }}>{trend}</div>}
  </div>
);

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: '240px', background: 'white', borderRight: '1px solid #ede8f5', display: 'flex', flexDirection: 'column', padding: '1.5rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '600', color: '#1a1040' }}>SkillSphere</span>
        </div>

        {[
          ['🏠', 'Dashboard', '/dashboard', true],
          ['🔍', 'Browse Gigs', '/gigs', false],
          ['📬', 'Proposals', '/proposals', false],
          ['💬', 'Messages', '/messages', false],
          ['💳', 'Payments', '/payments', false],
          ['⭐', 'Reviews', '/reviews', false],
          ['⚙️', 'Settings', '/settings', false],
        ].map(([icon, label, path, active]) => (
          <Link key={path} to={path} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 1.5rem', fontSize: '14px', fontWeight: active ? '600' : '400',
            color: active ? '#6C5CE7' : '#5a4f7a', textDecoration: 'none',
            background: active ? '#f5f2ff' : 'transparent',
            borderLeft: active ? '3px solid #6C5CE7' : '3px solid transparent',
            marginBottom: '2px', transition: 'all 0.15s',
          }}>
            <span>{icon}</span>{label}
          </Link>
        ))}

        <div style={{ marginTop: 'auto', padding: '1rem 1.5rem', borderTop: '1px solid #ede8f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: '600' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1040' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '11px', color: '#8b7fb8', textTransform: 'capitalize' }}>{user?.role || 'client'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '240px', padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '500', color: '#1a1040', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#8b7fb8', fontWeight: '300' }}>Here's what's happening on your workspace today.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '2rem' }}>
          <StatCard label="Active Gigs" value="12" icon="💼" trend="↑ 2 this week" color="#6C5CE7" />
          <StatCard label="Proposals" value="48" icon="📬" trend="↑ 8 new" color="#a29bfe" />
          <StatCard label="Total Earnings" value="₹84k" icon="💰" trend="↑ 12% this month" color="#4834C5" />
          <StatCard label="Avg. Rating" value="4.9" icon="⭐" color="#f9ca24" />
        </div>

        {/* Recent Activity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #ede8f5', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #ede8f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '500', color: '#1a1040', margin: 0 }}>Recent Proposals</h3>
              <Link to="/proposals" style={{ fontSize: '13px', color: '#6C5CE7', textDecoration: 'none', fontWeight: '500' }}>View all →</Link>
            </div>
            {[
              ['React Developer Needed', 'Ajay Kumar', '₹15,000', 'pending'],
              ['UI/UX Design for App', 'Sneha Reddy', '₹22,000', 'accepted'],
              ['Node.js API Integration', 'Rahul Dev', '₹9,500', 'pending'],
            ].map(([title, name, amount, status]) => (
              <div key={title} style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #faf8ff', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f5f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', color: '#6C5CE7', flexShrink: 0 }}>
                  {name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1040' }}>{title}</div>
                  <div style={{ fontSize: '12px', color: '#8b7fb8', fontWeight: '300' }}>{name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1040' }}>{amount}</div>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: '500', background: status === 'accepted' ? '#eafaf1' : '#fef9ec', color: status === 'accepted' ? '#1e8449' : '#b7770d' }}>{status}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(160deg, #6C5CE7 0%, #4834C5 100%)', borderRadius: '16px', padding: '1.5rem', color: 'white' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '500', marginBottom: '0.75rem' }}>Quick Actions</h3>
            {[['Post a new gig', '/gigs/new'],['Browse freelancers', '/freelancers'],['View messages', '/messages'],['Withdraw earnings', '/payments']].map(([label, path]) => (
              <Link key={path} to={path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', marginBottom: '8px', textDecoration: 'none', color: 'white', fontSize: '14px', fontWeight: '400', transition: 'background 0.15s' }}>
                {label} <span style={{ opacity: 0.7 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
