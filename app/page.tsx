"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div className="bg-[#faf9f7] text-[#1a1a1a]">

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Timeless Jewelry <br /> for Every Moment ✨
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Discover elegant bracelets, necklaces, rings, and watches crafted to elevate your everyday style.
          </p>

          <a
            href="#collection"
            className="bg-black text-white px-6 py-3 rounded-full text-sm hover:bg-gray-800 transition"
          >
            Shop Collection
          </a>
        </div>

        <img
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a"
          className="w-full md:w-[500px] rounded-2xl shadow-lg mt-10 md:mt-0"
        />
      </section>

      {/* IMAGE STRIP */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-20 pb-16">
        {[
          "https://images.unsplash.com/photo-1589128777073-263566ae5e4d",
          "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed",
          "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
        ].map((img, i) => (
          <img key={i} src={img} className="rounded-xl shadow-md" />
        ))}
      </section>

      {/* PRODUCTS */}
      <section id="collection" className="px-6 md:px-20 pb-20">
        <h2 className="text-3xl font-semibold mb-10">Our Collection</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No products yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={product.image}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    {product.name}
                  </h3>

                  <p className="text-gray-500 text-sm mb-2">
                    {product.category}
                  </p>

                  <p className="font-bold text-xl mb-4">
                    ₦{product.price}
                  </p>

                  <a
                    href={`https://wa.me/2348034485846?text=Hi, I'm interested in ${product.name}`}
                    target="_blank"
                    className="block text-center bg-black text-white py-2 rounded-full hover:bg-gray-800"
                  >
                    Order on WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* BANNER */}
      <section className="bg-black text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Shine Every Day ✨
        </h2>
        <p className="text-gray-300">
          Luxury jewelry that speaks confidence and elegance.
        </p>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/2348034485846?text=Hi, I want to make an enquiry about your jewelry"
        target="_blank"
        className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-full shadow-lg hover:bg-green-600"
      >
        💬 Chat on WhatsApp
      </a>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 py-6">
        © 2026 Floral Accessories. All rights reserved.
      </footer>

    </div>
  );
}
