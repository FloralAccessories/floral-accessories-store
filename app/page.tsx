'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Page() {
const [products, setProducts] = useState<any[]>([]);

useEffect(() => {
fetchProducts();
}, []);

async function fetchProducts() {
const { data } = await supabase.from('products').select('*');
setProducts(data || []);
}

return (
<main style={{ padding: 20 }}> <h1>Floral Accessories Store</h1>
  {products.length === 0 ? (
    <p>No products yet.</p>
  ) : (
    <div>
      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: 10 }}>
          <strong>{product.name}</strong> - ₦{product.price}
        </div>
      ))}
    </div>
  )}
</main>
);
}
