"use client";


import { useEffect, useState } from "react";
import { Users, Package, Settings, Search, Trash2, Edit2, Plus, UploadCloud } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy, addDoc, updateDoc } from "firebase/firestore";
import { mockProducts } from "@/data/products";

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("products");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    setLoading(true);
    if (activeTab === "enquiries") {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        try {
          const q = query(collection(db, "enquiries"), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const fbEnquiries = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            date: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
          }));
          setEnquiries(fbEnquiries);
        } catch (error) {
          console.error("Error loading enquiries from Firebase:", error);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("nw_enquiries") || "[]");
        setEnquiries(saved);
      }
    } else if (activeTab === "products") {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        try {
          const querySnapshot = await getDocs(collection(db, "products"));
          const fbProducts = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id
          }));
          setProducts(fbProducts);
        } catch (error) {
          console.error("Error loading products from Firebase:", error);
        }
      } else {
        const saved = JSON.parse(localStorage.getItem("nw_products") || JSON.stringify(mockProducts));
        setProducts(saved);
      }
    }
    setLoading(false);
  }

  const deleteEnquiry = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        await deleteDoc(doc(db, "enquiries", id));
      } else {
        const updated = enquiries.filter(e => e.id !== id);
        localStorage.setItem("nw_enquiries", JSON.stringify(updated));
      }
      loadData();
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        await deleteDoc(doc(db, "products", id));
      } else {
        const updated = products.filter(p => p.id !== id);
        localStorage.setItem("nw_products", JSON.stringify(updated));
      }
      loadData();
    }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        const productData = { ...currentProduct };
        const productId = productData.id;
        delete productData.id; // Don't save the Firestore document ID inside the document itself
        
        // Firestore doesn't allow undefined values, replace with null or delete
        Object.keys(productData).forEach(key => {
          if (productData[key] === undefined) {
            delete productData[key];
          }
        });

        if (productId) {
          // Update
          const productRef = doc(db, "products", productId);
          await updateDoc(productRef, productData);
        } else {
          // Add
          await addDoc(collection(db, "products"), productData);
        }
      } else {
        let updated = [...products];
        if (currentProduct.id) {
          updated = updated.map(p => p.id === currentProduct.id ? currentProduct : p);
        } else {
          updated.push({ ...currentProduct, id: Math.random().toString(36).substr(2, 9) });
        }
        localStorage.setItem("nw_products", JSON.stringify(updated));
      }
      setIsEditing(false);
      setCurrentProduct(null);
      loadData();
    } catch (error: any) {
      console.error("Error saving product:", error);
      alert("Failed to save product: " + error.message);
    }
  };

  const seedMockProducts = async () => {
    if (confirm("This will add the original mock products to Firebase. Continue?")) {
      for (const prod of mockProducts) {
        await addDoc(collection(db, "products"), prod);
      }
      loadData();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Admin Dashboard</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "products" ? "bg-nw-light/10 text-nw-dark" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "enquiries" ? "bg-nw-light/10 text-nw-dark" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5" />
            Enquiries
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h1>
          {activeTab === "products" && !isEditing && (
            <div className="flex gap-4">
              <button onClick={seedMockProducts} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                Seed Data
              </button>
              <button onClick={() => { setCurrentProduct({ name: "", description: "", category: "", minOrderQuantity: "", features: [], imageUrl: "" }); setIsEditing(true); }} className="bg-nw-dark text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-nw-mid">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          )}
        </div>

        {activeTab === "enquiries" && !isEditing && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading enquiries...</div>
            ) : enquiries.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No enquiries found. Check back later!</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Name / Company</th>
                    <th className="p-4 font-medium">Contact</th>
                    <th className="p-4 font-medium">Product / Qty</th>
                    <th className="p-4 font-medium">Message</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-gray-50/50">
                      <td className="p-4 text-sm text-gray-600 align-top">
                        {new Date(enq.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-900">{enq.name}</div>
                        <div className="text-sm text-gray-500">{enq.company}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-sm text-gray-900">{enq.email}</div>
                        <div className="text-sm text-gray-500">{enq.phone}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-sm font-medium text-gray-900">{enq.productOfInterest || "-"}</div>
                        <div className="text-sm text-gray-500">{enq.quantity || "-"}</div>
                      </td>
                      <td className="p-4 align-top max-w-xs text-sm text-gray-600 line-clamp-3">
                        {enq.message || "-"}
                      </td>
                      <td className="p-4 align-top text-right">
                        <button onClick={() => deleteEnquiry(enq.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "products" && !isEditing && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No products found. Click "Seed Data" or "Add Product".</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
                    <th className="p-4 font-medium">Image</th>
                    <th className="p-4 font-medium">Name / Category</th>
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Min Order</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50">
                      <td className="p-4 align-top">
                        {prod.imageUrl ? (
                          <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        <div className="font-medium text-gray-900">{prod.name}</div>
                        <div className="text-sm text-gray-500">{prod.category}</div>
                      </td>
                      <td className="p-4 align-top max-w-xs text-sm text-gray-600 line-clamp-2">
                        {prod.description}
                      </td>
                      <td className="p-4 align-top text-sm font-medium text-gray-900">
                        {prod.minOrderQuantity}
                      </td>
                      <td className="p-4 align-top text-right">
                        <button onClick={() => { setCurrentProduct(prod); setIsEditing(true); }} className="text-nw-dark hover:text-nw-mid p-2 rounded-lg hover:bg-nw-light/10 transition-colors mr-2">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => deleteProduct(prod.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {isEditing && currentProduct && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm max-w-2xl">
            <h2 className="text-xl font-bold mb-6">{currentProduct.id ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={saveProduct} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input required type="text" value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input required type="text" value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Order Quantity</label>
                  <input required type="text" value={currentProduct.minOrderQuantity} onChange={e => setCurrentProduct({...currentProduct, minOrderQuantity: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea required rows={3} value={currentProduct.description} onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input type="text" value={currentProduct.imageUrl || ""} onChange={e => setCurrentProduct({...currentProduct, imageUrl: e.target.value})} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid" />
                <p className="text-xs text-gray-500 mt-1">Paste an image link. Later we can integrate Firebase Storage for direct uploads.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (Comma separated)</label>
                <input type="text" value={currentProduct.features ? currentProduct.features.join(", ") : ""} onChange={e => setCurrentProduct({...currentProduct, features: e.target.value.split(",").map((f:string) => f.trim())})} placeholder="Eco-friendly, Biodegradable, Heat-resistant" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-nw-mid" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="submit" className="bg-nw-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-nw-mid">Save Product</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
