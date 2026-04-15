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
};

type CartItem = Product & { quantity: number };

const PHONE = '2348034485846';

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*');
    setProducts(data || []);
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);

      if (found) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function changeQty(id: number, type: 'inc' | 'dec') {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) return item;
          const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  function checkout() {
    if (cart.length === 0) return alert('Cart is empty');

    const text = cart
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} x${item.quantity} - ₦${
            item.price * item.quantity
          }`
      )
      .join('\n');

    const msg = `Hello, I want to order:\n\n${text}\n\nTotal: ₦${total}`;

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,
      '_blank'
    );
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome to Floral Accessories Store ✨</h1>

      <button onClick={() => setOpenCart(true)}>
        Open Cart ({cart.length})
      </button>

      <div style={{ display: 'grid', gap: 20, marginTop: 20 }}>
        {products.map((p) => (
          <div key={p.id} style={{ border: '1px solid #ccc', padding: 10 }}>
            <img
              src={p.image_url}
              style={{ width: '100%', height: 200, objectFit: 'cover' }}
            />
            <h3>{p.name}</h3>
            <p>₦{p.price}</p>

            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </div>
        ))}
      </div>

      {openCart && (
        <div
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: '90%',
            maxWidth: 400,
            height: '100%',
            background: 'white',
            padding: 20,
            boxShadow: '-5px 0 20px rgba(0,0,0,0.2)',
          }}
        >
          <button onClick={() => setOpenCart(false)}>Close</button>

          <h2>Your Cart</h2>

          {cart.map((item) => (
            <div key={item.id}>
              <p>{item.name}</p>
              <p>₦{item.price}</p>

              <button onClick={() => changeQty(item.id, 'dec')}>-</button>
              {item.quantity}
              <button onClick={() => changeQty(item.id, 'inc')}>+</button>

              <button onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          <h3>Total: ₦{total}</h3>

          <button onClick={checkout}>Checkout on WhatsApp</button>
        </div>
      )}
    </main>
  );
}
