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

  async function addProduct() {
    setLoading(true);

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

    setName('');
    setPrice('');
    setCategory('');
    setImage('');
    setDescription('');
    fetchProducts();
  }

  async function deleteProduct(id: number) {
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      alert('Error deleting product: ' + error.message);
      return;
    }

    alert('Product deleted successfully!');
    fetchProducts();
  }

  return (
    <main style={{ padding: 40, maxWidth: 900, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Add Product</h1>

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
        placeholder="Category (Bracelet, Ring...)"
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
        style={{ ...inputStyle, height: 100 }}
      />

      <button onClick={addProduct} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>

      <h2 style={{ marginTop: 40 }}>Your Products</h2>

      <div style={{ display: 'grid', gap: 16, marginTop: 20 }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 12,
              padding: 16,
              display: 'flex',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px' }}>{product.name}</h3>
              <p style={{ margin: '0 0 4px' }}>{product.category}</p>
              <p style={{ margin: 0, fontWeight: 'bold' }}>₦{product.price}</p>
            </div>

            <button
              onClick={() => deleteProduct(product.id)}
              style={{
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '10px 14px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: '1px solid #ccc',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  width: '100%',
  padding: 14,
  background: 'black',
  color: 'white',
  borderRadius: 10,
  border: 'none',
  fontWeight: 'bold',
  cursor: 'pointer',
};
