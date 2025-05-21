"use client";
import Link from "next/link";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Menu, X, ShoppingCart, LayoutDashboard, Leaf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <nav className="bg-white text-black px-4 py-1 shadow-md absolute w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <video
              src="/temp/plant.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-10 h-10 object-cover rounded-full"
            />
          </motion.div>
        </Link>

        {/* Desktop Links with Icons */}
        <div className="hidden md:flex space-x-8 font-semibold items-center text-lg">
          {[
            { href: "/", label: "Home" },
            { href: "/plants", label: "Plants" },
            { href: "/services", label: "Services" },
            { href: "/pots", label: "Pots" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="group relative transition">
              <span className="group-hover:text-green-700 transition">
                {label}
              </span>
              <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-700 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative flex items-center gap-1 group text-lg"
          >
            <ShoppingCart size={20} />
            <span className="group-hover:text-green-700">Cart</span>
            {cartCount > 0 && ( <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>)}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {/* Dashboard Icon */}
          <Link
            href="/account"
            className="flex items-center gap-1 group text-lg"
          >
            <LayoutDashboard size={20} />
            <span className="group-hover:text-green-700">Account</span>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-green-700 transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>

        {/* Mobile Cart + Hamburger */}
        <div className="md:hidden p-1 flex items-center gap-4 h-full cursor-pointer">
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart size={28} className="hover:text-green-200" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-0 left-0 w-full h-screen bg-green-900/90 backdrop-blur-sm z-40 text-white flex flex-col justify-center items-center space-y-6 px-4"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Menu"
              className="absolute top-5 right-5 text-white"
            >
              <X size={36} />
            </button>

            {/* Navigation Links */}
            {["/", "/plants", "/services", "/pots", "/account"].map(
              (path, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    href={path}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-semibold hover:text-green-300 transition"
                  >
                    {path === "/"
                      ? "Home"
                      : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
