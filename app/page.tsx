'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
  in_stock: boolean;
};

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = '2348034485846';
const HERO_IMAGE =
  'https://fbqgvzdeybxbxvoiktzp.supabase.co/storage/v1/object/public/products/Screenshot%202026-04-15%20202704.png';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=85';

function formatPrice(value: number) {
  return `₦${Number(value || 0).toLocaleString('en-NG')}`;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) console.error(error.message);
    setProducts((data || []) as Product[]);
    setLoading(false);
  }

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch = !term || p.name.toLowerCase().includes(term) || (p.description || '').toLowerCase().includes(term);
      const matchesCategory = category === 'All' || p.category === category;
      return p.in_stock && matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.id === product.id);
      if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
  }

  function orderNow(product: Product) {
    const message = `Hello Floral Accessories Store, I want to order:\n\nProduct: ${product.name}\nPrice: ${formatPrice(product.price)}\n\nPlease confirm availability.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function checkoutOnWhatsApp() {
    if (!cart.length) return;
    const items = cart.map((item, i) => `${i + 1}. ${item.name} x${item.quantity} — ${formatPrice(Number(item.price) * item.quantity)}`).join('\n');
    const message = `Hello Floral Accessories Store, I want to place an order:\n\n${items}\n\nTotal: ${formatPrice(cartTotal)}\n\nPlease confirm availability and delivery details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <img src={HERO_IMAGE} alt="Floral Accessories" style={styles.logo} />
          <div><strong>FLORAL ACCESSORIES</strong><span>Jewelry • Perfumes • Elegance</span></div>
        </div>
        <button style={styles.cartTop} onClick={() => setShowCart(true)}>Bag ({cartCount})</button>
      </header>

      <section style={styles.hero}>
        <div>
          <p style={styles.eyebrow}>Luxury, made effortless</p>
          <h1 style={styles.heroTitle}>Beautiful pieces.<br />Beautifully yours.</h1>
          <p style={styles.heroText}>Discover elegant jewelry and fragrances selected to help you look classy, feel confident and leave a lasting impression.</p>
          <a href="#collection" style={styles.primary}>Shop Collection</a>
        </div>
        <img src={HERO_IMAGE} alt="Floral Accessories collection" style={styles.heroImage} />
      </section>

      <section id="collection" style={styles.collection}>
        <div style={styles.sectionHeading}>
          <div><p style={styles.eyebrow}>Floral Accessories</p><h2 style={styles.sectionTitle}>Our Collection</h2></div>
          <a href="/admin/login" style={styles.adminLink}>Owner Login</a>
        </div>

        <div style={styles.filters}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jewelry or perfume..." style={styles.input} />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input}>
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {loading ? <div style={styles.message}>Loading our collection...</div> : visibleProducts.length === 0 ? <div style={styles.message}>No products are currently available in this category.</div> : (
          <div style={styles.grid}>
            {visibleProducts.map((product) => (
              <article key={product.id} style={styles.card}>
                <div style={styles.imageWrap}><img src={product.image_url || FALLBACK_IMAGE} alt={product.name} style={styles.productImage} /></div>
                <div style={styles.cardBody}>
                  <span style={styles.category}>{product.category}</span>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.description}>{product.description || 'A beautiful Floral Accessories piece for your collection.'}</p>
                  <div style={styles.price}>{formatPrice(product.price)}</div>
                  <div style={styles.actions}>
                    <button onClick={() => orderNow(product)} style={styles.orderButton}>Order Now</button>
                    <button onClick={() => addToCart(product)} style={styles.addButton}>Add to Bag</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer style={styles.footer}><strong>FLORAL ACCESSORIES</strong><span>Elegant jewelry & perfumes • Open 24/7 online</span></footer>

      <button onClick={() => setShowCart(true)} style={styles.floating}>Bag ({cartCount})</button>

      {showCart && <div style={styles.overlay} onClick={() => setShowCart(false)}>
        <aside style={styles.drawer} onClick={(e) => e.stopPropagation()}>
          <div style={styles.drawerHeader}><h2 style={{ margin: 0 }}>Your Bag</h2><button onClick={() => setShowCart(false)} style={styles.close}>×</button></div>
          {!cart.length ? <div style={styles.message}>Your bag is empty.<br />Add something beautiful.</div> : <>
            <div>{cart.map((item) => <div key={item.id} style={styles.cartItem}>
              <img src={item.image_url || FALLBACK_IMAGE} alt={item.name} style={styles.cartImage} />
              <div style={{ flex: 1 }}><strong>{item.name}</strong><div style={{ marginTop: 5, color: '#777' }}>{formatPrice(item.price)}</div><div style={styles.qty}><button onClick={() => changeQuantity(item.id, -1)}>-</button><span>{item.quantity}</span><button onClick={() => changeQuantity(item.id, 1)}>+</button></div></div>
              <strong>{formatPrice(Number(item.price) * item.quantity)}</strong>
            </div>)}</div>
            <div style={styles.total}><span>Total</span><strong>{formatPrice(cartTotal)}</strong></div>
            <button onClick={checkoutOnWhatsApp} style={styles.checkout}>Checkout on WhatsApp</button>
          </>}
        </aside>
      </div>}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#fffaf5', color: '#2b171b', fontFamily: 'Georgia, serif' },
  header: { maxWidth: 1180, margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eadbd5' },
  brand: { display: 'flex', alignItems: 'center', gap: 12 },
  logo: { width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid #d9b9ae' },
  brand: { display: 'flex', alignItems: 'center', gap: 12 },
  cartTop: { border: '1px solid #6e1f2b', background: 'transparent', color: '#6e1f2b', padding: '10px 16px', borderRadius: 999, cursor: 'pointer', fontWeight: 700 },
  hero: { maxWidth: 1180, margin: '0 auto', padding: '60px 20px 80px', display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 50, alignItems: 'center' },
  eyebrow: { textTransform: 'uppercase', letterSpacing: 3, fontSize: 11, color: '#8b6670', margin: '0 0 12px' },
  heroTitle: { fontSize: 'clamp(42px, 6vw, 74px)', lineHeight: 1.02, margin: '0 0 20px', color: '#651b29', fontWeight: 500 },
  heroText: { fontFamily: 'Arial, sans-serif', color: '#6c5a5e', lineHeight: 1.7, maxWidth: 550, marginBottom: 30 },
  primary: { display: 'inline-block', background: '#6e1f2b', color: '#fff', padding: '14px 22px', borderRadius: 999, textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontWeight: 700 },
  heroImage: { width: '100%', height: 430, objectFit: 'cover', borderRadius: 28, boxShadow: '0 22px 60px rgba(80,25,35,.16)' },
  collection: { maxWidth: 1180, margin: '0 auto', padding: '20px 20px 90px' },
  sectionHeading: { display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 22 },
  sectionTitle: { margin: 0, fontSize: 38, fontWeight: 500, color: '#651b29' },
  adminLink: { color: '#8b6670', textDecoration: 'none', fontFamily: 'Arial, sans-serif', fontSize: 13 },
  filters: { display: 'grid', gridTemplateColumns: '1fr 220px', gap: 12, marginBottom: 26 },
  input: { width: '100%', boxSizing: 'border-box', padding: '14px 16px', borderRadius: 14, border: '1px solid #ddcbc5', background: '#fff', fontFamily: 'Arial, sans-serif', outline: 'none' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 22 },
  card: { background: '#fff', border: '1px solid #eadbd5', borderRadius: 22, overflow: 'hidden', boxShadow: '0 8px 28px rgba(80,25,35,.06)' },
  imageWrap: { background: '#f4ebe6' },
  productImage: { width: '100%', height: 280, objectFit: 'cover', display: 'block' },
  cardBody: { padding: 18 },
  category: { fontFamily: 'Arial, sans-serif', color: '#9a747c', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5 },
  productName: { margin: '7px 0', fontSize: 22, fontWeight: 500 },
  description: { fontFamily: 'Arial, sans-serif', color: '#75676a', lineHeight: 1.5, minHeight: 45, fontSize: 13 },
  price: { color: '#651b29', fontSize: 20, fontWeight: 700, margin: '15px 0' },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 },
  orderButton: { border: 0, background: '#6e1f2b', color: '#fff', padding: '12px 10px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 },
  addButton: { border: '1px solid #6e1f2b', background: '#fff', color: '#6e1f2b', padding: '12px 10px', borderRadius: 12, cursor: 'pointer', fontWeight: 700 },
  message: { background: '#fff', border: '1px dashed #d8c4bd', borderRadius: 20, padding: 35, textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#76666a', lineHeight: 1.6 },
  footer: { borderTop: '1px solid #eadbd5', padding: '30px 20px', display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap', fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#8b6670' },
  floating: { position: 'fixed', right: 18, bottom: 18, zIndex: 20, background: '#6e1f2b', color: '#fff', border: 0, borderRadius: 999, padding: '14px 20px', boxShadow: '0 8px 25px rgba(60,15,25,.25)', cursor: 'pointer', fontWeight: 700 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(30,10,15,.45)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' },
  drawer: { width: 'min(460px, 100%)', height: '100%', background: '#fffaf5', padding: 24, boxSizing: 'border-box', overflowY: 'auto' },
  drawerHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, color: '#651b29' },
  close: { border: 0, background: 'transparent', fontSize: 32, cursor: 'pointer', color: '#651b29' },
  cartItem: { display: 'flex', gap: 12, alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eadbd5', fontFamily: 'Arial, sans-serif', fontSize: 13 },
  cartImage: { width: 64, height: 64, objectFit: 'cover', borderRadius: 10 },
  qty: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 },
  qty: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 },
  total: { display: 'flex', justifyContent: 'space-between', margin: '25px 0', fontFamily: 'Arial, sans-serif', fontSize: 18 },
  checkout: { width: '100%', border: 0, background: '#25D366', color: '#fff', padding: 16, borderRadius: 14, fontWeight: 700, cursor: 'pointer', fontSize: 15 }
};
