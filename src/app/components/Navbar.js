// components/Navbar.js
'use client'
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-700 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          🌱 Nursery
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 font-medium">
          <Link href="/">Home</Link>
          <Link href="/plants">Plants</Link>
          <Link href="/services">Services</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        {/* Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 text-center font-medium">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/plants" onClick={() => setIsOpen(false)}>Plants</Link>
          <Link href="/services" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/cart" onClick={() => setIsOpen(false)}>Cart</Link>
          <Link href="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
        </div>
      )}
    </nav>
  );
}
