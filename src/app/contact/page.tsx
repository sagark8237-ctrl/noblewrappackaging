"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Building2, Phone, Mail } from "lucide-react";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function EnquiryFormContent() {
  const searchParams = useSearchParams();
  const initialProduct = searchParams.get("product") || "";
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    productOfInterest: initialProduct,
    quantity: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync initialProduct if URL changes
  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ ...prev, productOfInterest: initialProduct }));
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY && process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "your-api-key") {
        // Save to Firebase
        await addDoc(collection(db, "enquiries"), {
          ...formData,
          status: "New",
          createdAt: serverTimestamp(),
        });
      } else {
        // Fallback to LocalStorage
        const existingEnquiries = JSON.parse(localStorage.getItem("nw_enquiries") || "[]");
        const newEnquiry = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          ...formData,
          status: "New"
        };
        localStorage.setItem("nw_enquiries", JSON.stringify([newEnquiry, ...existingEnquiries]));
      }
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      alert("There was an error submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 text-nw-dark p-8 rounded-2xl text-center border border-green-100">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-nw-mid shadow-sm">
          <Send className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Enquiry Sent Successfully!</h3>
        <p className="text-green-800">
          Thank you for reaching out to Noblewrap. Our sales team will get back to you shortly regarding your bulk order enquiry.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: "", company: "", email: "", phone: "", productOfInterest: "", quantity: "", message: "" });
          }}
          className="mt-6 text-nw-dark font-medium hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
          <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="ABC Corp" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="john@company.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="+1 (555) 000-0000" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product of Interest</label>
          <input type="text" value={formData.productOfInterest} onChange={e => setFormData({...formData, productOfInterest: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="E.g. Paper Cups (8oz)" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Quantity</label>
          <input type="text" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all" placeholder="E.g. 50,000 units" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
        <textarea rows={4} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-nw-mid/20 focus:border-nw-mid outline-none transition-all resize-none" placeholder="Please provide any specific requirements or questions..."></textarea>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full bg-nw-dark text-white font-semibold py-4 rounded-lg hover:bg-nw-mid transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
        <Send className="w-5 h-5" />
        {isSubmitting ? "Submitting..." : "Submit Bulk Enquiry"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Get in Touch</h1>
            <p className="text-gray-600">
              Ready to place a bulk order or need custom packaging solutions? Contact our sales team today.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-nw-light/10 rounded-xl flex items-center justify-center text-nw-dark shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Headquarters</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  MIDC, Plot No. A28/3,<br />
                  Kinhi MIDC, Bhusawal,<br />
                  Dist. Jalgaon, Maharashtra, India
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-nw-light/10 rounded-xl flex items-center justify-center text-nw-dark shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Customer Care</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  +91 9922471616<br />
                  Available during business hours
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-nw-light/10 rounded-xl flex items-center justify-center text-nw-dark shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  info@noblewrappackaging.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl shadow-gray-200/40">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Send an Enquiry</h2>
          <Suspense fallback={<div className="h-64 flex items-center justify-center text-gray-400">Loading form...</div>}>
            <EnquiryFormContent />
          </Suspense>
        </div>

      </div>
    </div>
  );
}
