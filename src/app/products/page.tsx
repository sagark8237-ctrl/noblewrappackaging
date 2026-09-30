"use client";

import { useEffect, useState } from "react";
import { mockProducts } from "@/data/products";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const fbProducts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setProducts(fbProducts.length > 0 ? fbProducts : mockProducts);
        } catch (error) {
          console.error("Error loading products from Firebase:", error);
          setProducts(mockProducts);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("nw_products") || "[]");
        setProducts(saved.length > 0 ? saved : mockProducts);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">Product Catalogue</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
          Explore our extensive range of premium disposable paper products. As a manufacturer, we strictly cater to bulk commercial orders.
        </p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading products...</div>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 }
              }}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full group hover:border-nw-light/30"
            >
              {/* Product Image */}
              <div className="h-56 bg-[#f4f9f4] border-b border-gray-100 flex items-center justify-center relative overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <ShoppingBag className="w-12 h-12 text-nw-mid/40 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full text-nw-dark shadow-sm border border-nw-light/20">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-6 flex-1 font-light leading-relaxed">{product.description}</p>
                
                <div className="mb-6 space-y-2">
                  {product.features?.slice(0, 3).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 font-light">
                      <CheckCircle2 className="w-4 h-4 text-nw-mid shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Min Order</p>
                    <p className="font-semibold text-gray-900">{product.minOrderQuantity}</p>
                  </div>
                  <Link
                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                    className="bg-[#f4f9f4] text-nw-dark border border-nw-light/20 hover:bg-nw-mid hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm hover:shadow"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
