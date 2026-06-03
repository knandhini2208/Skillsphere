import { Link } from 'react-router-dom';
export default function GigNew() {
  return (
    <div style={{minHeight:'100vh',background:'#faf8ff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <div style={{background:'white',borderRadius:'20px',padding:'3rem',width:'100%',maxWidth:'600px',boxShadow:'0 20px 60px rgba(108,92,231,0.15)'}}>
        <h1 style={{fontSize:'28px',color:'#1a1040',marginBottom:'8px'}}>Post a New Gig</h1>
        <p style={{color:'#8b7fb8',marginBottom:'2rem',fontSize:'14px'}}>Fill in the details to find the perfect freelancer</p>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Gig Title</label>
          <input type="text" placeholder="e.g. React Developer for E-Commerce" style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
        </div>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Category</label>
          <select style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}>
            <option>Web Development</option>
            <option>Design</option>
            <option>Data Science</option>
            <option>Mobile</option>
          </select>
        </div>
        <div style={{marginBottom:'1rem'}}>
          <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Description</label>
          <textarea rows={4} placeholder="Describe your project..." style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box',resize:'none'}} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'1rem'}}>
          <div>
            <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Budget Min (₹)</label>
            <input type="number" placeholder="5000" style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
          <div>
            <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Budget Max (₹)</label>
            <input type="number" placeholder="20000" style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
          </div>
        </div>
        <div style={{marginBottom:'1.5rem'}}>
          <label style={{display:'block',fontSize:'13px',fontWeight:500,color:'#3d3060',marginBottom:'6px'}}>Required Skills</label>
          <input type="text" placeholder="e.g. React, Node.js, MongoDB" style={{width:'100%',border:'1.5px solid #e8e3f5',borderRadius:'10px',padding:'11px 14px',fontSize:'14px',outline:'none',boxSizing:'border-box'}} />
        </div>
        <button style={{width:'100%',background:'linear-gradient(135deg,#6C5CE7,#4834C5)',color:'white',border:'none',borderRadius:'12px',padding:'13px',fontSize:'15px',fontWeight:600,cursor:'pointer'}}>Post Gig →</button>
        <Link to="/gigs" style={{display:'block',textAlign:'center',marginTop:'1rem',color:'#6C5CE7',fontSize:'13px',textDecoration:'none'}}>← Back to Marketplace</Link>
      </div>
    </div>
  );
}
