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

const WHATSAPP_NUMBER = '2348034485846';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);

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
    setCart((prev) => [...prev, product]);
  }

  function checkoutOnWhatsApp() {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    const itemsText = cart
      .map((item, index) => `${index + 1}. ${item.name} - ${formatPrice(item.price)}`)
      .join('\n');

    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

    const message = `Hello Floral Accessories Store, I want to order:\n\n${itemsText}\n\nTotal: ${formatPrice(total)}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#fffaf5',
        color: '#111827',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '70px 20px 40px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: 30,
            alignItems: 'center',
          }}
        >
          <div>
            <p
              style={{
                textTransform: 'uppercase',
                letterSpacing: 2,
                color: '#9ca3af',
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              Floral Accessories
            </p>

            <h1
              style={{
                fontSize: 54,
                lineHeight: 1.1,
                margin: '0 0 16px',
              }}
            >
              Welcome to Floral Accessories Store
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: '#4b5563',
                maxWidth: 540,
                marginBottom: 24,
              }}
            >
              Discover timeless elegance, beautiful jewelry, and stylish pieces
              designed to make every moment shine.
            </p>

            <a
              href="#collection"
              style={{
                display: 'inline-block',
                background: '#111111',
                color: 'white',
                borderRadius: 16,
                padding: '14px 22px',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Shop Collection
            </a>
          </div>

          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
            alt="Jewelry display"
            style={{
              width: '100%',
              height: 430,
              objectFit: 'cover',
              borderRadius: 28,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            }}
          />
        </div>
      </section>

      <section
        id="collection"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '10px 20px 70px',
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <p
            style={{
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: '#9ca3af',
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            Shop now
          </p>

          <h2 style={{ fontSize: 34, margin: 0 }}>Our Collection</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 220px',
            gap: 14,
            marginBottom: 28,
          }}
        >
          <input
            type="text"
            placeholder="Search product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #d1d5db',
              borderRadius: 16,
              fontSize: 15,
              boxSizing: 'border-box',
            }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid #d1d5db',
              borderRadius: 16,
              fontSize: 15,
              background: 'white',
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div
            style={{
              background: 'white',
              border: '1px dashed #d1d5db',
              borderRadius: 24,
              padding: 36,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#6b7280' }}>Loading products...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div
            style={{
              background: 'white',
              border: '1px dashed #d1d5db',
              borderRadius: 24,
              padding: 36,
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 10 }}>No products yet</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              Add products in your admin page and they will show here.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: 20,
            }}
          >
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
                }}
              >
                <img
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 260,
                    objectFit: 'cover',
                  }}
                />

                <div style={{ padding: 18 }}>
                  <p
                    style={{
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      fontSize: 12,
                      margin: '0 0 8px',
                    }}
                  >
                    {product.category}
                  </p>

                  <h3 style={{ margin: '0 0 10px' }}>{product.name}</h3>

                  <p
                    style={{
                      color: '#6b7280',
                      minHeight: 42,
                      margin: '0 0 12px',
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description || 'Beautiful accessory for your style.'}
                  </p>

                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: 18,
                      margin: '0 0 14px',
                    }}
                  >
                    {formatPrice(product.price)}
                  </p>

                  <div style={{ display: 'grid', gap: 10 }}>
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        width: '100%',
                        background: '#111111',
                        color: 'white',
                        border: 'none',
                        borderRadius: 14,
                        padding: '12px 14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Add to Cart
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello Floral Accessories Store, I want to enquire about ${product.name}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
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
                      }}
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
        onClick={checkoutOnWhatsApp}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: '#25D366',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          padding: '14px 20px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
        }}
      >
        Checkout on WhatsApp ({cart.length})
      </button>
    </main>
  );
}
