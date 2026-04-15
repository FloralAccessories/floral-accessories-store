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

type CartItem = Product & {
  quantity: number;
};

const WHATSAPP_NUMBER = '2348034485846';

// PASTE YOUR LOGO / BANNER IMAGE URL HERE
const HERO_IMAGE =
  'PASTE_YOUR_IMAGE_URL_HERE';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
      setProducts([]);
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  }

  const categories = useMemo(() => {
    return ['All', ...new Set(products.map((product) => product.category).filter(Boolean))];
  }, [products]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === 'All' || product.category === categoryFilter;

      return matchesSearch && matchesCategory && product.in_stock;
    });
  }, [products, search, categoryFilter]);

  function formatPrice(price: number) {
    return `₦${Number(price).toLocaleString()}`;
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function increaseQuantity(id: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  function checkoutOnWhatsApp() {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const itemsText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.name} x${item.quantity} - ${formatPrice(
            item.price * item.quantity
          )}`
      )
      .join('\n');

    const message = `Hello Floral Accessories Store, I want to order:\n\n${itemsText}\n\nTotal: ${formatPrice(cartTotal)}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <main style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.heroText}>
          <p style={styles.eyebrow}>Floral Accessories</p>
          <h1 style={styles.heroTitle}>Welcome to Floral Accessories Store</h1>
          <p style={styles.heroSubtitle}>
            Look classy, smell intentional, and shine with beautiful pieces made
            for every moment.
          </p>

          <div style={styles.heroButtons}>
            <a href="#collection" style={styles.primaryButton}>
              Shop Collection
            </a>

            <button
              onClick={() => setShowCart(true)}
              style={styles.secondaryButton}
            >
              Open Cart ({cartCount})
            </button>
          </div>
        </div>

        <div style={styles.heroImageWrap}>
          <img
            src={HERO_IMAGE}
            alt="Floral Accessories banner"
            style={styles.heroImage}
          />
        </div>
      </section>

      <section id="collection" style={styles.collectionSection}>
        <div style={{ marginBottom: 20 }}>
          <p style={styles.eyebrow}>Shop now</p>
          <h2 style={styles.collectionTitle}>Our Collection</h2>
        </div>

        <div style={styles.filtersWrap}>
          <input
            type="text"
            placeholder="Search product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={styles.input}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={styles.emptyBox}>
            <p style={{ margin: 0, color: '#6b7280' }}>Loading products...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>No products yet</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Add products in your admin page and they will show here.
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {visibleProducts.map((product) => (
              <div key={product.id} style={styles.card}>
                <img
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  style={styles.cardImage}
                />

                <div style={styles.cardBody}>
                  <p style={styles.cardCategory}>{product.category}</p>
                  <h3 style={styles.cardTitle}>{product.name}</h3>

                  <p style={styles.cardDescription}>
                    {product.description || 'Beautiful accessory for your style.'}
                  </p>

                  <p style={styles.cardPrice}>{formatPrice(product.price)}</p>

                  <div style={styles.cardButtons}>
                    <button
                      onClick={() => addToCart(product)}
                      style={styles.darkButton}
                    >
                      Add to Cart
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello Floral Accessories Store, I want to enquire about ${product.name}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.whatsappButton}
                    >
                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button
        onClick={() => setShowCart(true)}
        style={styles.floatingCartButton}
      >
        Cart ({cartCount})
      </button>

      {showCart && (
        <div style={styles.overlay}>
          <div style={styles.cartPanel}>
            <div style={styles.cartHeader}>
              <h2 style={{ margin: 0 }}>Your Cart</h2>

              <button
                onClick={() => setShowCart(false)}
                style={styles.closeButton}
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={styles.emptyBox}>
                <p style={{ margin: 0, color: '#6b7280' }}>Your cart is empty.</p>
              </div>
            ) : (
              <>
                <div style={styles.cartItemsWrap}>
                  {cart.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={styles.cartItemImage}
                      />

                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 6px' }}>{item.name}</h4>
                        <p style={{ margin: '0 0 8px', color: '#6b7280' }}>
                          {formatPrice(item.price)}
                        </p>

                        <div style={styles.qtyWrap}>
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            style={styles.qtyButton}
                          >
                            -
                          </button>

                          <span style={{ minWidth: 20, textAlign: 'center' }}>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            style={styles.qtyButton}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 700 }}>
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={styles.removeButton}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.cartFooter}>
                  <h3 style={{ marginTop: 0 }}>Total: {formatPrice(cartTotal)}</h3>

                  <button
                    onClick={checkoutOnWhatsApp}
                    style={styles.checkoutButton}
                  >
                    Checkout on WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#fffaf5',
    color: '#111827',
    fontFamily: 'Arial, sans-serif',
  },
  heroSection: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '20px 16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    alignItems: 'center',
  },
  heroText: {},
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 'clamp(32px, 6vw, 56px)',
    lineHeight: 1.08,
    margin: '0 0 14px',
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 1.7,
    color: '#4b5563',
    maxWidth: 540,
    marginBottom: 22,
  },
  heroButtons: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-block',
    background: '#111111',
    color: 'white',
    borderRadius: 14,
    padding: '13px 20px',
    fontWeight: 700,
    textDecoration: 'none',
  },
  secondaryButton: {
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: 14,
    padding: '13px 20px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  heroImageWrap: {
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: 'auto',
    maxHeight: 520,
    objectFit: 'cover',
    borderRadius: 24,
    boxShadow: '0 12px 34px rgba(0,0,0,0.14)',
  },
  collectionSection: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '8px 16px 90px',
  },
  collectionTitle: {
    fontSize: 30,
    margin: 0,
  },
  filtersWrap: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #d1d5db',
    borderRadius: 16,
    fontSize: 15,
    background: 'white',
    boxSizing: 'border-box',
  },
  emptyBox: {
    background: 'white',
    border: '1px dashed #d1d5db',
    borderRadius: 24,
    padding: 32,
    textAlign: 'center',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 18,
  },
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 22,
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
  },
  cardImage: {
    width: '100%',
    height: 260,
    objectFit: 'cover',
  },
  cardBody: {
    padding: 18,
  },
  cardCategory: {
    color: '#9ca3af',
    textTransform: 'uppercase',
    fontSize: 12,
    margin: '0 0 8px',
  },
  cardTitle: {
    margin: '0 0 10px',
  },
  cardDescription: {
    color: '#6b7280',
    margin: '0 0 12px',
    lineHeight: 1.5,
    minHeight: 42,
  },
  cardPrice: {
    fontWeight: 700,
    fontSize: 18,
    margin: '0 0 14px',
  },
  cardButtons: {
    display: 'grid',
    gap: 10,
  },
  darkButton: {
    width: '100%',
    background: '#111111',
    color: 'white',
    border: 'none',
    borderRadius: 14,
    padding: '12px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  whatsappButton: {
    display: 'inline-block',
    width: '100%',
    textAlign: 'center',
    background: '#25D366',
    color: 'white',
    borderRadius: 14,
    padding: '12px 14px',
    fontWeight: 700,
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
  floatingCartButton: {
    position: 'fixed',
    bottom: 18,
    right: 18,
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: 999,
    padding: '14px 18px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    zIndex: 1000,
    maxWidth: 'calc(100vw - 36px)',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1200,
  },
  cartPanel: {
    width: '100%',
    maxWidth: 460,
    height: '100%',
    background: 'white',
    padding: 20,
    overflowY: 'auto',
    boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
  },
  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
  },
  cartItemsWrap: {
    display: 'grid',
    gap: 14,
  },
  cartItem: {
    display: 'flex',
    gap: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  cartItemImage: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: 10,
    flexShrink: 0,
  },
  qtyWrap: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  qtyButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: '1px solid #d1d5db',
    background: 'white',
    cursor: 'pointer',
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
  },
  cartFooter: {
    borderTop: '1px solid #e5e7eb',
    marginTop: 18,
    paddingTop: 18,
  },
  checkoutButton: {
    width: '100%',
    background: '#25D366',
    color: 'white',
    border: 'none',
    borderRadius: 14,
    padding: '14px 18px',
    fontWeight: 700,
    cursor: 'pointer',
  },
};
