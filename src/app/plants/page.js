"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
import { addToCart } from "../../redux/store/cardSlice";
import styles from "../plants/plants.module.css";

export default function PotsPage() {
  const [pots, setPots] = useState([]);
  const [filteredPots, setFilteredPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    const fetchPots = async () => {
      try {
        const res = await fetch("/api/pots");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPots(data);
        setFilteredPots(data);
      } catch (error) {
        console.error("Error fetching pots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPots();
  }, []);

  useEffect(() => {
    const query = searchTerm.toLowerCase();
    const filtered = pots.filter(
      (pot) =>
        pot.name.toLowerCase().includes(query) ||
        pot.material.toLowerCase().includes(query) ||
        pot.price.toString().includes(query)
    );
    setFilteredPots(filtered);
  }, [searchTerm, pots]);

  const handleAddToCart = (pot) => {
    dispatch(addToCart(pot));
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-15 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Available Pots</h1>

        {isAdmin && (
          <Link href="/pots/add">
            <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Add New Pot
            </button>
          </Link>
        )}

        {/* Search Bar */}
        <div className="relative w-full px-5 mx-auto mb-6 max-w-2xl">
          <input
            type="text"
            placeholder="Search by name, material, or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-md"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black text-xl font-semibold pr-4 mr-1"
              aria-label="Clear"
            >
              &times;
            </button>
          )}
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["Ceramic", "Plastic", "Terracotta", "Metal", "Concrete", "Wood"].map((label) => (
            <button
              key={label}
              onClick={() => setSearchTerm(label)}
              className="cursor-pointer px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 text-sm"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center ${styles.plantGrid}`}
        >
          {filteredPots.length === 0 ? (
            <p className="col-span-full text-gray-600">No matching pots found.</p>
          ) : (
            filteredPots.map((pot) => (
              <div
                key={pot._id}
                className="bg-white rounded-lg shadow-md flex flex-col"
              >
                <img
                  src={pot.imageUrl}
                  alt={pot.name}
                  className="w-45 h-35 sm:h-40 object-fill rounded-lg"
                />

                <h2 className="text-xl font-semibold text-green-800">
                  {pot.name}
                </h2>

                <div className="flex justify-around items-center">
                  <span className="text-green-700 font-bold text-lg">
                    ₹{pot.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      pot.stock ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {pot.stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-1 mt-auto">
                  <Link href={`/pots/${pot._id}`} className="w-full">
                    <div className="bg-blue-500 text-white text-center w-full px-1 py-1.5 rounded hover:bg-blue-600 text-sm">
                      View Product
                    </div>
                  </Link>

                  <button
                    onClick={() => handleAddToCart(pot)}
                    className={`cursor-pointer px-1 py-1.5 rounded text-sm flex items-center justify-center w-full ${
                      pot.stock
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                    title={pot.stock ? "Add to Cart" : "Out of Stock"}
                    disabled={!pot.stock}
                  >
                    <FaCartPlus className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
