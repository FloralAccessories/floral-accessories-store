'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  description: string;
  in_stock: boolean;
};

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });

    if (!error) {
      setProducts(data || []);
    }
  }

  function resetForm() {
    setName('');
    setPrice('');
    setCategory('');
    setImage('');
    setDescription('');
    setEditingId(null);
  }

  async function saveProduct() {
    setLoading(true);

    if (!name || !price || !category) {
      alert('Please fill product name, price, and category.');
      setLoading(false);
      return;
    }

    if (editingId !== null) {
      const { error } = await supabase
        .from('products')
        .update({
          name,
          price: Number(price),
          category,
          image_url: image,
          description,
          in_stock: true,
        })
        .eq('id', editingId);

      setLoading(false);

      if (error) {
        alert('Error updating product: ' + error.message);
        return;
      }

      alert('Product updated successfully!');
    } else {
      const { error } = await supabase.from('products').insert([
        {
          name,
          price: Number(price),
          category,
          image_url: image,
          description,
          in_stock: true,
        },
      ]);

      setLoading(false);

      if (error) {
        alert('Error adding product: ' + error.message);
        return;
      }

      alert('Product added successfully!');
    }

    resetForm();
    fetchProducts();
  }

  function startEdit(product: Product) {
    setName(product.name || '');
    setPrice(String(product.price || ''));
    setCategory(product.category || '');
    setImage(product.image_url || '');
    setDescription(product.description || '');
    setEditingId(product.id);
    setOpenMenuId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteProduct(id: number) {
    const confirmed = window.confirm('Are you sure you want to delete this product?');

    if (!confirmed) return;

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
      return;
    }

    alert('Product deleted successfully!');
    setOpenMenuId(null);

    if (editingId === id) {
      resetForm();
    }

    fetchProducts();
  }

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#111827',
      }}
    >
      <div
        style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: 18,
          padding: 20,
          boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
          marginBottom: 28,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>
          {editingId !== null ? 'Edit Product' : 'Add Product'}
        </h1>

        <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 20 }}>
          Add new products or update existing ones for your store.
        </p>

        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Category (Bracelet, Ring, Necklace...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: 110, resize: 'vertical' }}
        />

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={saveProduct} style={buttonStyle}>
            {loading ? 'Saving...' : editingId !== null ? 'Update Product' : 'Add Product'}
          </button>

          {editingId !== null && (
            <button
              onClick={resetForm}
              style={{
                ...buttonStyle,
                background: '#f3f4f6',
                color: '#111827',
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 style={{ marginBottom: 16 }}>All Products</h2>

        {products.length === 0 ? (
          <div
            style={{
              background: 'white',
              border: '1px dashed #d1d5db',
              borderRadius: 18,
              padding: 24,
              textAlign: 'center',
              color: '#6b7280',
            }}
          >
            No products yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {products.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 18,
                  padding: 16,
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  background: 'white',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}
              >
                <img
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={product.name}
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: 'cover',
                    borderRadius: 14,
                    flexShrink: 0,
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ margin: '0 0 6px' }}>{product.name}</h3>
                  <p style={{ margin: '0 0 6px', color: '#6b7280' }}>{product.category}</p>
                  <p style={{ margin: '0 0 6px', fontWeight: 700 }}>₦{product.price}</p>
                  <p
                    style={{
                      margin: 0,
                      color: '#4b5563',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.description}
                  </p>
                </div>

                <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === product.id ? null : product.id)
                    }
                    style={menuButtonStyle}
                  >
                    ⋮
                  </button>

                  {openMenuId === product.id && (
                    <div style={menuBoxStyle}>
                      <button
                        onClick={() => startEdit(product)}
                        style={menuItemStyle}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{ ...menuItemStyle, color: '#dc2626' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: '1px solid #d1d5db',
  boxSizing: 'border-box' as const,
  fontSize: 15,
};

const buttonStyle = {
  padding: '12px 18px',
  background: 'black',
  color: 'white',
  borderRadius: 10,
  border: 'none',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
};

const menuButtonStyle = {
  width: 38,
  height: 38,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  background: 'white',
  cursor: 'pointer',
  fontSize: 20,
  lineHeight: 1,
};

const menuBoxStyle = {
  position: 'absolute' as const,
  top: 44,
  right: 0,
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  boxShadow: '0 10px 24px rgba(0,0,0,0.08)',
  minWidth: 120,
  overflow: 'hidden',
  zIndex: 20,
};

const menuItemStyle = {
  width: '100%',
  padding: '12px 14px',
  border: 'none',
  background: 'white',
  textAlign: 'left' as const,
  cursor: 'pointer',
  fontSize: 14,
};
