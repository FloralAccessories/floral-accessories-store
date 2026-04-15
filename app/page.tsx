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

export default function Page() {
const [products, setProducts] = useState<Product[]>([]);
const [search, setSearch] = useState('');
const [categoryFilter, setCategoryFilter] = useState('All');

useEffect(() => {
fetchProducts();
}, []);

async function fetchProducts() {
const { data, error } = await supabase
.from('products')
.select('*')
.order('id', { ascending: false });

```
if (!error) {
  setProducts(data || []);
}
```

}

const visibleProducts = useMemo(() => {
return products.filter((product) => {
const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
return matchesSearch && matchesCategory && product.in_stock;
});
}, [products, search, categoryFilter]);

const categories = ['All', ...new Set(products.map((p) => p.category))];

const formatPrice = (price: number) => `₦${Number(price).toLocaleString()}`;

return (
<main style={{ background: '#fffdf9', minHeight: '100vh', color: '#111827' }}>
<section
style={{
padding: '80px 20px 50px',
maxWidth: 1200,
margin: '0 auto',
display: 'grid',
gridTemplateColumns: '1.1fr 1fr',
gap: 30,
alignItems: 'center',
}}
> <div>
<p style={{ letterSpacing: 2, textTransform: 'uppercase', color: '#6b7280', fontSize: 13 }}>
Floral Accessories </p>
<h1 style={{ fontSize: 56, lineHeight: 1.1, margin: '10px 0 16px' }}>
Jewelry that makes every outfit shine </h1>
<p style={{ fontSize: 18, color: '#4b5563', maxWidth: 540 }}>
Discover elegant jewelry pieces for your everyday style and special moments. </p> </div>

```
    <img
      src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80"
      alt="Jewelry display"
      style={{
        width: '100%',
        height: 430,
        objectFit: 'cover',
        borderRadius: 28,
      }}
    />
  </section>

  <section style={{ maxWidth: 1200, margin: '0 auto', padding: '10px 20px 60px' }}>
    <div style={{ marginBottom: 24 }}>
      <p style={{ letterSpacing: 2, textTransform: 'uppercase', color: '#6b7280', fontSize: 13 }}>
        Shop now
      </p>
      <h2 style={{ fontSize: 36, margin: '8px 0' }}>Our Collection</h2>
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search product name"
        style={{
          width: '100%',
          padding: '14px 16px',
          borderRadius: 16,
          border: '1px solid #d1d5db',
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
          borderRadius: 16,
          border: '1px solid #d1d5db',
          fontSize: 15,
          background: 'white',
        }}
      >
        {categories.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
    </div>

    {visibleProducts.length === 0 ? (
      <div
        style={{
          background: 'white',
          border: '1px dashed #d1d5db',
          borderRadius: 24,
          padding: 32,
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginBottom: 8 }}>No products yet</h3>
        <p style={{ color: '#6b7280' }}>
          Add your first products in Supabase and they will appear here.
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
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: 260, objectFit: 'cover' }}
            />

            <div style={{ padding: 18 }}>
              <p style={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: 12 }}>
                {product.category}
              </p>
              <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
              <p style={{ color: '#6b7280', minHeight: 40 }}>{product.description}</p>
              <p style={{ fontWeight: 700, marginTop: 10 }}>{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
</main>
```

);
}
