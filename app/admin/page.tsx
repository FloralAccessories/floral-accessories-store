'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

type Product = { id:number; name:string; price:number; category:string; image_url:string; description:string; in_stock:boolean };
const ADMIN_EMAIL='floralaccessories35@gmail.com';

export default function AdminPage(){
 const router=useRouter();
 const [authorized,setAuthorized]=useState(false);
 const [name,setName]=useState(''); const [price,setPrice]=useState(''); const [category,setCategory]=useState(''); const [image,setImage]=useState(''); const [description,setDescription]=useState('');
 const [loading,setLoading]=useState(false); const [products,setProducts]=useState<Product[]>([]); const [editingId,setEditingId]=useState<number|null>(null); const [openMenuId,setOpenMenuId]=useState<number|null>(null);
 useEffect(()=>{checkAdmin()},[]);
 async function checkAdmin(){const {data:{user}}=await supabase.auth.getUser(); if(!user||user.email?.toLowerCase()!==ADMIN_EMAIL){router.replace('/admin/login');return;} setAuthorized(true); fetchProducts();}
 async function fetchProducts(){const {data,error}=await supabase.from('products').select('*').order('id',{ascending:false}); if(!error)setProducts(data||[]);}
 function resetForm(){setName('');setPrice('');setCategory('');setImage('');setDescription('');setEditingId(null);}
 async function saveProduct(){if(!name||!price||!category){alert('Please fill product name, price, and category.');return;}setLoading(true);let error;if(editingId!==null){({error}=await supabase.from('products').update({name,price:Number(price),category,image_url:image,description,in_stock:true}).eq('id',editingId));}else{({error}=await supabase.from('products').insert([{name,price:Number(price),category,image_url:image,description,in_stock:true}]));}setLoading(false);if(error){alert(error.message);return;}resetForm();fetchProducts();}
 function startEdit(p:Product){setName(p.name||'');setPrice(String(p.price||''));setCategory(p.category||'');setImage(p.image_url||'');setDescription(p.description||'');setEditingId(p.id);setOpenMenuId(null);window.scrollTo({top:0,behavior:'smooth'});}
 async function deleteProduct(id:number){if(!confirm('Are you sure you want to delete this product?'))return;const {error}=await supabase.from('products').delete().eq('id',id);if(error){alert(error.message);return;}setOpenMenuId(null);if(editingId===id)resetForm();fetchProducts();}
 async function signOut(){await supabase.auth.signOut();router.replace('/admin/login');}
 if(!authorized)return <main style={{padding:40,textAlign:'center',fontFamily:'Arial'}}>Checking admin access...</main>;
 return <main style={{padding:24,maxWidth:1000,margin:'0 auto',fontFamily:'Arial,sans-serif',color:'#111827'}}>
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:20}}><div><p style={{color:'#8b1530',letterSpacing:2,fontSize:11,fontWeight:700}}>FLORAL ACCESSORIES</p><h1 style={{margin:'0 0 4px',fontFamily:'Georgia,serif'}}>Product Dashboard</h1><p style={{margin:0,color:'#6b7280'}}>Add, edit or remove products from your online store.</p></div><button onClick={signOut} style={{padding:'10px 14px',borderRadius:10,border:'1px solid #ddd',background:'white',cursor:'pointer'}}>Sign out</button></div>
  <section style={{background:'white',border:'1px solid #e5e7eb',borderRadius:18,padding:20,boxShadow:'0 6px 20px rgba(0,0,0,.04)',marginBottom:28}}><h2 style={{marginTop:0}}>{editingId!==null?'Edit Product':'Add Product'}</h2>
   <input placeholder="Product Name" value={name} onChange={e=>setName(e.target.value)} style={input}/><input placeholder="Price (₦)" value={price} onChange={e=>setPrice(e.target.value)} style={input}/><input placeholder="Category (Jewelry, Perfumes...)" value={category} onChange={e=>setCategory(e.target.value)} style={input}/><input placeholder="Product Image URL" value={image} onChange={e=>setImage(e.target.value)} style={input}/><textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} style={{...input,height:100,resize:'vertical'}}/>
   <div style={{display:'flex',gap:10}}><button onClick={saveProduct} disabled={loading} style={button}>{loading?'Saving...':editingId!==null?'Update Product':'Add Product'}</button>{editingId!==null&&<button onClick={resetForm} style={{...button,background:'#f3f4f6',color:'#111'}}>Cancel</button>}</div>
  </section>
  <h2>All Products</h2><div style={{display:'grid',gap:14}}>{products.map(p=><div key={p.id} style={{border:'1px solid #e5e7eb',borderRadius:16,padding:14,display:'flex',gap:14,alignItems:'center',background:'white',position:'relative'}}><img src={p.image_url||'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=300&q=80'} alt={p.name} style={{width:80,height:80,objectFit:'cover',borderRadius:12}}/><div style={{flex:1}}><b>{p.name}</b><div style={{color:'#8b1530',fontWeight:700}}>₦{Number(p.price).toLocaleString()}</div><small style={{color:'#6b7280'}}>{p.category}</small></div><button onClick={()=>setOpenMenuId(openMenuId===p.id?null:p.id)} style={{border:0,background:'transparent',fontSize:24,cursor:'pointer'}}>⋮</button>{openMenuId===p.id&&<div style={{position:'absolute',right:12,top:55,background:'white',border:'1px solid #ddd',borderRadius:10,boxShadow:'0 8px 20px rgba(0,0,0,.12)',padding:6,zIndex:2}}><button onClick={()=>startEdit(p)} style={menu}>Edit</button><button onClick={()=>deleteProduct(p.id)} style={{...menu,color:'#b00020'}}>Delete</button></div>}</div>)}</div>
 </main>;
}
const input:React.CSSProperties={width:'100%',boxSizing:'border-box',padding:13,marginBottom:12,border:'1px solid #d1d5db',borderRadius:10,fontSize:15};
const button:React.CSSProperties={padding:'12px 18px',border:0,borderRadius:10,background:'#5a0712',color:'white',fontWeight:700,cursor:'pointer'};
const menu:React.CSSProperties={display:'block',width:'100%',border:0,background:'white',padding:'9px 14px',textAlign:'left',cursor:'pointer'};
