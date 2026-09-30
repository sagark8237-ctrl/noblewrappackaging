import type { Metadata } from "next";
import Image from "next/image";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontSerif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noblewrap | Premium Disposable Paper Products",
  description: "Manufacturer and supplier of premium bulk disposable paper items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fcfdfa] font-sans">
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a href="/" className="block relative h-16 w-48">
                <Image src="/logo-transparent.png" alt="Noblewrap Logo" fill className="object-contain" priority />
              </a>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" className="text-gray-600 hover:text-nw-mid transition-colors">Home</a>
              <a href="/products" className="text-gray-600 hover:text-nw-mid transition-colors">Products</a>
              <a href="/about" className="text-gray-600 hover:text-nw-mid transition-colors">About</a>
              <a href="/contact" className="bg-nw-mid text-white px-5 py-2.5 rounded-md hover:bg-nw-dark transition-colors shadow-sm">
                Enquire Now
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="mb-4 relative h-12 w-36">
                  <Image src="/logo-transparent.png" alt="Noblewrap Logo" fill className="object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100" />
                </div>
                <p className="text-gray-500 text-sm">
                  Premium manufacturer of eco-friendly disposable paper products for all your business needs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="/" className="hover:text-nw-mid">Home</a></li>
                  <li><a href="/products" className="hover:text-nw-mid">Products</a></li>
                  <li><a href="/contact" className="hover:text-nw-mid">Contact Us</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li><span className="font-medium text-gray-700">Email:</span> info@noblewrappackaging.com</li>
                  <li><span className="font-medium text-gray-700">Customer Care:</span> +91 9922471616</li>
                  <li className="leading-relaxed"><span className="font-medium text-gray-700">Address:</span><br/>MIDC, Plot No. A28/3, Kinhi MIDC,<br/>Bhusawal, Dist. Jalgaon,<br/>Maharashtra, India</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-12 pt-8 text-sm text-gray-400 flex flex-col sm:flex-row justify-between items-center">
              <p>&copy; {new Date().getFullYear()} Noblewrap. All rights reserved.</p>
              <a href="/nw-admin-portal" className="text-transparent hover:text-gray-300 transition-colors mt-4 sm:mt-0">Admin Portal</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
