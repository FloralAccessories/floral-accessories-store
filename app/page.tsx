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
      console.error(error.message);
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
    <main className="page">
      <section className="hero-wrap">
        <div className="hero-text">
          <p className="eyebrow">Floral Accessories</p>
          <h1>Welcome to Floral Accessories Store</h1>
          <p className="subtext">
            Discover timeless elegance, beautiful jewelry, and stylish pieces
            designed to make every moment shine.
          </p>

          <a href="#collection" className="primary-btn">
            Shop Collection
          </a>
        </div>

        <div className="hero-image-box">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
            alt="Jewelry display"
            className="hero-image"
          />
        </div>
      </section>

      <section id="collection" className="collection-wrap">
        <div className="heading-block">
          <p className="eyebrow">Shop now</p>
          <h2>Our Collection</h2>
        </div>

        <div className="filters">
          <input
            type="text"
            placeholder="Search product name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="empty-box">
            <p>Loading products...</p>
          </div>
        ) : visibleProducts.length === 0 ? (
          <div className="empty-box">
            <h3>No products yet</h3>
            <p>Add products in your admin page and they will show here.</p>
          </div>
        ) : (
          <div className="products-grid">
            {visibleProducts.map((product) => (
              <div key={product.id} className="card">
                <img
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  className="card-image"
                />

                <div className="card-body">
                  <p className="category">{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className="description">
                    {product.description || 'Beautiful accessory for your style.'}
                  </p>
                  <p className="price">{formatPrice(product.price)}</p>

                  <div className="card-actions">
                    <button onClick={() => addToCart(product)} className="dark-btn">
                      Add to Cart
                    </button>

                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                        `Hello Floral Accessories Store, I want to enquire about ${product.name}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="whatsapp-btn"
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

      <button onClick={checkoutOnWhatsApp} className="floating-checkout">
        Checkout on WhatsApp ({cart.length})
      </button>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #fffaf5;
          color: #111827;
          font-family: Arial, sans-serif;
        }

        .hero-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 16px 32px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 40px;
          line-height: 1.1;
          margin: 0 0 14px;
        }

        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #9ca3af;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .subtext {
          font-size: 16px;
          line-height: 1.7;
          color: #4b5563;
          max-width: 540px;
          margin-bottom: 22px;
        }

        .primary-btn {
          display: inline-block;
          background: #111111;
          color: white;
          border-radius: 14px;
          padding: 13px 20px;
          font-weight: 700;
          text-decoration: none;
        }

        .hero-image-box {
          width: 100%;
        }

        .hero-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .collection-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 8px 16px 90px;
        }

        .heading-block {
          margin-bottom: 20px;
        }

        .heading-block h2 {
          font-size: 30px;
          margin: 0;
        }

        .filters {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .input {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 16px;
          font-size: 15px;
          background: white;
          box-sizing: border-box;
        }

        .empty-box {
          background: white;
          border: 1px dashed #d1d5db;
          border-radius: 24px;
          padding: 32px 20px;
          text-align: center;
        }

        .empty-box h3 {
          margin-top: 0;
          margin-bottom: 10px;
        }

        .empty-box p {
          margin: 0;
          color: #6b7280;
        }

        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 18px;
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
        }

        .card-image {
          width: 100%;
          height: 260px;
          object-fit: cover;
        }

        .card-body {
          padding: 18px;
        }

        .category {
          color: #9ca3af;
          text-transform: uppercase;
          font-size: 12px;
          margin: 0 0 8px;
        }

        .card-body h3 {
          margin: 0 0 10px;
        }

        .description {
          color: #6b7280;
          margin: 0 0 12px;
          line-height: 1.5;
        }

        .price {
          font-weight: 700;
          font-size: 18px;
          margin: 0 0 14px;
        }

        .card-actions {
          display: grid;
          gap: 10px;
        }

        .dark-btn {
          width: 100%;
          background: #111111;
          color: white;
          border: none;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .whatsapp-btn {
          display: inline-block;
          width: 100%;
          text-align: center;
          background: #25d366;
          color: white;
          border-radius: 14px;
          padding: 12px 14px;
          font-weight: 700;
          text-decoration: none;
          box-sizing: border-box;
        }

        .floating-checkout {
          position: fixed;
          bottom: 18px;
          right: 18px;
          background: #25d366;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 14px 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          max-width: calc(100vw - 36px);
        }

        @media (min-width: 768px) {
          .hero-wrap {
            padding: 70px 20px 40px;
            grid-template-columns: 1.1fr 1fr;
            gap: 30px;
          }

          .hero-text h1 {
            font-size: 54px;
          }

          .subtext {
            font-size: 18px;
          }

          .hero-image {
            height: 430px;
          }

          .collection-wrap {
            padding: 10px 20px 90px;
          }

          .filters {
            grid-template-columns: 1fr 220px;
            gap: 14px;
            margin-bottom: 28px;
          }

          .products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (min-width: 1100px) {
          .products-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}
