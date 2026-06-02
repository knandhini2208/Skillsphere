import { useState } from 'react';
import { Link } from 'react-router-dom';

const GIGS = [
  { id:1, title:'React Developer for E-Commerce Platform', client:'TechVentures Pvt', category:'Web Dev', budget:'₹20k–40k', deadline:'2 weeks', skills:['React','Node.js','MongoDB'], proposals:14, time:'2h ago' },
  { id:2, title:'UI/UX Designer for Mobile App Redesign', client:'AppStudio', category:'Design', budget:'₹15k–25k', deadline:'1 month', skills:['Figma','Prototyping','UI Design'], proposals:9, time:'5h ago' },
  { id:3, title:'Python ML Model for Demand Forecasting', client:'RetailCorp', category:'Data Science', budget:'₹35k–60k', deadline:'3 weeks', skills:['Python','TensorFlow','Pandas'], proposals:6, time:'1d ago' },
  { id:4, title:'WordPress Website with WooCommerce', client:'ShopEase', category:'Web Dev', budget:'₹8k–15k', deadline:'1 week', skills:['WordPress','WooCommerce','PHP'], proposals:22, time:'3h ago' },
  { id:5, title:'Video Editor for YouTube Channel (Weekly)', client:'CreatorHub', category:'Video', budget:'₹5k–10k/mo', deadline:'Ongoing', skills:['Premiere Pro','After Effects'], proposals:31, time:'6h ago' },
  { id:6, title:'Flutter App for Delivery Service', client:'QuickDeliver', category:'Mobile', budget:'₹30k–50k', deadline:'6 weeks', skills:['Flutter','Dart','Firebase'], proposals:11, time:'12h ago' },
];

const CATS = ['All','Web Dev','Design','Data Science','Mobile','Video','Marketing'];

export default function GigMarketplace() {
  const [active, setActive] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = GIGS.filter(g =>
    (active === 'All' || g.category === active) &&
    (g.title.toLowerCase().includes(search.toLowerCase()) || g.skills.some(s => s.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#faf8ff', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #ede8f5', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '600', color: '#1a1040' }}>SkillSphere</span>
        </div>
        <div style={{ flex: 1, maxWidth: '440px', margin: '0 2rem', position: 'relative' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gigs or skills..."
            style={{ width: '100%', border: '1.5px solid #e8e3f5', borderRadius: '10px', padding: '9px 16px 9px 40px', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', color: '#1a1040' }}
            onFocus={e => e.target.style.borderColor='#6C5CE7'}
            onBlur={e => e.target.style.borderColor='#e8e3f5'}
          />
          <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a090c0" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <Link to="/gigs/new" style={{ background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', color: 'white', textDecoration: 'none', padding: '9px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}>
          + Post Gig
        </Link>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Hero Banner */}
        <div style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #4834C5 100%)', borderRadius: '20px', padding: '2.5rem 3rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: '500', color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>Find Your Next Project</h1>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.75)', fontWeight: '300' }}>{GIGS.length} live gigs in your area · Updated every hour</p>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[['2.4k+','Freelancers'],['98%','Success Rate'],['₹12Cr+','Paid Out']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '600', color: 'white' }}>{n}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '300' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{
              padding: '7px 18px', borderRadius: '20px', border: '1.5px solid', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s',
              borderColor: active === cat ? '#6C5CE7' : '#e8e3f5',
              background: active === cat ? '#6C5CE7' : 'white',
              color: active === cat ? 'white' : '#5a4f7a',
            }}>{cat}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#8b7fb8', alignSelf: 'center' }}>{filtered.length} results</span>
        </div>

        {/* Gig Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {filtered.map(gig => (
            <div key={gig.id} style={{ background: 'white', borderRadius: '16px', border: '1px solid #ede8f5', padding: '1.25rem 1.5rem', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', background: '#f5f2ff', color: '#6C5CE7', padding: '3px 10px', borderRadius: '20px', fontWeight: '600' }}>{gig.category}</span>
                <span style={{ fontSize: '11px', color: '#b0a0cc', fontWeight: '300' }}>{gig.time}</span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '500', color: '#1a1040', lineHeight: '1.4', marginBottom: '6px' }}>{gig.title}</h3>
              <p style={{ fontSize: '12px', color: '#8b7fb8', marginBottom: '12px', fontWeight: '300' }}>{gig.client}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {gig.skills.map(s => (
                  <span key={s} style={{ fontSize: '11px', background: '#faf8ff', border: '1px solid #e8e3f5', color: '#5a4f7a', padding: '3px 8px', borderRadius: '6px', fontWeight: '400' }}>{s}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #faf8ff' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1040' }}>{gig.budget}</div>
                  <div style={{ fontSize: '11px', color: '#b0a0cc', fontWeight: '300' }}>⏱ {gig.deadline}</div>
                </div>
                <button style={{ background: 'linear-gradient(135deg, #6C5CE7, #4834C5)', color: 'white', border: 'none', borderRadius: '8px', padding: '7px 16px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                  Apply →
                </button>
              </div>
              <div style={{ fontSize: '11px', color: '#b0a0cc', marginTop: '8px', fontWeight: '300' }}>💬 {gig.proposals} proposals</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
