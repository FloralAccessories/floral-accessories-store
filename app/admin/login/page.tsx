'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

const ADMIN_EMAIL = 'floraaccessories35@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('This login is only for the Floral Accessories administrator.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace('/admin');
  }

  return (
    <main style={{minHeight:'100vh',background:'#fffaf5',display:'grid',placeItems:'center',padding:20,fontFamily:'Arial,sans-serif'}}>
      <form onSubmit={submit} style={{width:'100%',maxWidth:430,background:'white',border:'1px solid #eadfd7',borderRadius:22,padding:28,boxShadow:'0 12px 30px rgba(0,0,0,.06)'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <p style={{letterSpacing:3,color:'#8b1530',fontSize:11,fontWeight:700}}>FLORAL ACCESSORIES</p>
          <h1 style={{fontFamily:'Georgia,serif',fontWeight:500}}>Admin Login</h1>
          <p style={{color:'#6b7280',fontSize:14}}>Sign in to manage your products.</p>
        </div>
        <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:14}}>Email
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required style={input}/>
        </label>
        <label style={{display:'block',fontSize:13,fontWeight:700,marginBottom:14}}>Password
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required placeholder="Your admin password" style={input}/>
        </label>
        {error && <p style={{background:'#fff0f0',color:'#a00',padding:12,borderRadius:10,fontSize:13}}>{error}</p>}
        <button disabled={loading} style={{width:'100%',padding:14,border:0,borderRadius:12,background:'#5a0712',color:'white',fontWeight:700,cursor:'pointer'}}>{loading?'Signing in...':'Sign in'}</button>
      </form>
    </main>
  );
}

const input: React.CSSProperties={width:'100%',marginTop:7,padding:13,border:'1px solid #d9cec5',borderRadius:10,boxSizing:'border-box',fontSize:15};
