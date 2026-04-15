'use client';
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <hr />
                  <p><strong>Total: {formatPrice(cartTotal)}</strong></p>
                </div>
              </div>
            )}
          </>
        )}

        {view === 'admin' && (
          <>
            {!loggedIn ? (
              <div style={{ ...box, maxWidth: 520, margin: '0 auto' }}>
                <p style={{ textTransform: 'uppercase', letterSpacing: 2, color: '#6b7280' }}>Private area</p>
                <h2>Owner Dashboard Login</h2>
                <p style={{ color: '#4b5563' }}>Use your Supabase email and password to enter the owner dashboard.</p>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Owner email" style={input} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" style={input} />
                <button onClick={handleLogin} style={blackButton}>Login as Owner</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.35fr', gap: 20 }}>
                <div style={box}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={handleLogout} style={borderButton}>Logout</button>
                  </div>
                  <input value={productForm.name} onChange={(e) => setProductForm((p) => ({ ...p, name: e.target.value }))} placeholder="Product name" style={input} />
                  <input value={productForm.price} onChange={(e) => setProductForm((p) => ({ ...p, price: e.target.value }))} placeholder="Price in naira" type="number" style={input} />
                  <select value={productForm.category} onChange={(e) => setProductForm((p) => ({ ...p, category: e.target.value }))} style={input}>
                    <option>Bracelet</option>
                    <option>Necklace</option>
                    <option>Earring</option>
                    <option>Ring</option>
                    <option>Chain</option>
                    <option>Watch</option>
                  </select>
                  <input value={productForm.image_url} onChange={(e) => setProductForm((p) => ({ ...p, image_url: e.target.value }))} placeholder="Product image URL" style={input} />
                  <textarea value={productForm.description} onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))} placeholder="Short product description" style={{ ...input, minHeight: 110 }} />
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
                    <input type="checkbox" checked={productForm.in_stock} onChange={(e) => setProductForm((p) => ({ ...p, in_stock: e.target.checked }))} />
                    Show this product in stock on the customer website
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveProduct} style={{ ...blackButton, flex: 1 }}>{editingId ? 'Update Product' : 'Add Product'}</button>
                    <button onClick={resetForm} style={{ ...borderButton, flex: 1 }}>Clear</button>
                  </div>
                </div>
                <div style={box}>
                  <h2>Your Products</h2>
                  {products.length === 0 ? <p>No products yet.</p> : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {products.map((product) => (
                        <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: 20, padding: 14, display: 'flex', gap: 14, alignItems: 'center' }}>
                          <img src={product.image_url} alt={product.name} style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 16 }} />
                          <div style={{ flex: 1 }}>
                            <strong>{product.name}</strong>
                            <p style={{ margin: '6px 0', color: '#6b7280' }}>{product.category} · {formatPrice(product.price)}</p>
                            <p style={{ margin: 0, color: '#4b5563' }}>{product.description}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button onClick={() => startEdit(product)} style={borderButton}>Edit</button>
                            <button onClick={() => deleteProduct(product.id)} style={borderButton}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
