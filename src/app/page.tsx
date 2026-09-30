"use client";

import { ArrowRight, Leaf, PackageSearch, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full relative py-32 sm:py-48 flex flex-col items-center text-center px-4 overflow-hidden min-h-[80vh] justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 -z-30">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay for text readability and jungle tint */}
        <div className="absolute inset-0 bg-[#f4f9f4]/40 -z-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#fcfdfa] via-transparent to-transparent -z-10"></div>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          transition={{ staggerChildren: 0.2 }}
          className="flex flex-col items-center max-w-4xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-nw-light/30 text-nw-dark text-sm font-medium mb-8 shadow-sm backdrop-blur">
            <Leaf className="w-4 h-4 text-nw-mid" />
            <span>Eco-Friendly Manufacturing</span>
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-7xl font-bold font-serif text-gray-900 tracking-tight mb-6 leading-tight">
            Welcome to <span className="text-nw-dark italic">Noblewrap</span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-light">
            The premier manufacturer of high-quality disposable paper items. We supply businesses worldwide with reliable, sustainable, and bulk packaging solutions.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-nw-dark text-white px-8 py-4 rounded-full font-medium hover:bg-[#1b4d2a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PackageSearch className="w-5 h-5" />
              View Product Catalogue
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-nw-dark border border-nw-light/30 px-8 py-4 rounded-full font-medium hover:bg-[#f8fdf8] transition-all shadow-sm group"
            >
              Send an Enquiry
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#f4f9f4] transition-colors border border-transparent hover:border-nw-light/20"
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-nw-light/20 flex items-center justify-center mb-6 text-nw-dark">
            <PackageSearch className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 mb-3">Bulk Quantities</h3>
          <p className="text-gray-600 leading-relaxed font-light">
            As a direct manufacturer, we fulfill large-scale orders efficiently and cost-effectively for your commercial needs.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#f4f9f4] transition-colors border border-transparent hover:border-nw-light/20"
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-nw-light/20 flex items-center justify-center mb-6 text-nw-dark">
            <Leaf className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 mb-3">Sustainable Materials</h3>
          <p className="text-gray-600 leading-relaxed font-light">
            Our paper products are crafted from responsibly sourced materials, minimizing environmental impact.
          </p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-[#f4f9f4] transition-colors border border-transparent hover:border-nw-light/20"
        >
          <div className="w-20 h-20 rounded-full bg-white shadow-sm border border-nw-light/20 flex items-center justify-center mb-6 text-nw-dark">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-serif text-gray-900 mb-3">Premium Quality</h3>
          <p className="text-gray-600 leading-relaxed font-light">
            Rigorous quality control ensures that every item meets the highest standards of durability and safety.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
