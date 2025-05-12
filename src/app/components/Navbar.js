'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShoppingCart, LayoutDashboard, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white px-4 py-3 shadow-md absolute w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <Leaf size={28} />
          Nursery
        </Link>

        {/* Desktop Links with Icons */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/" className="hover:text-green-200">Home</Link>
          <Link href="/plants" className="hover:text-green-200">Plants</Link>
          <Link href="/services" className="hover:text-green-200">Services</Link>

          {/* Cart Icon */}
          <Link href="/cart" className="hover:text-green-200 flex items-center gap-1">
            <ShoppingCart size={20} />
            <span>Cart</span>
          </Link>

          {/* Dashboard Icon */}
          <Link href="/dashboard" className="hover:text-green-200 flex items-center gap-1">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Mobile Cart + Hamburger */}
        <div className="md:hidden flex items-center gap-4 cursor-pointer">
          <Link href="/cart" aria-label="Cart">
            <ShoppingCart size={24} className="hover:text-green-200" />
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu " className=' cursor-pointer'>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="md:hidden mt-2 text-center font-medium overflow-hidden"
          >
            {['/', '/plants', '/services', '/dashboard'].map((path, index) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 * index }}
              >
                <Link
                  href={path}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 hover:text-green-200 transition"
                >
                  {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
