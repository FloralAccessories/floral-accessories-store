'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Clear form
    setName('');
    setPrice('');
    setCategory('');
    setImage('');
    setDescription('');
  }

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: '0 auto' }}>
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
    </main>
  );
}

const inputStyle = {
  width: '100%',
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: '1px solid #ccc',
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
