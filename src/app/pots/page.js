"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { addToCart } from "../../redux/store/cardSlice";
import styles from "../plants/plants.module.css";

export default function PotsPage() {
  const [pots, setPots] = useState([]);
  const [filteredPots, setFilteredPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sortOrder, setSortOrder] = useState("");
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
    let filtered = [...pots];

    const query = searchQuery.toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (pot) =>
          pot.name.toLowerCase().includes(query) ||
          pot.material.toLowerCase().includes(query) ||
          pot.price.toString().includes(query)
      );
    }

    if (selectedSize) {
      filtered = filtered.filter((pot) => pot.size === selectedSize);
    }

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredPots(filtered);
  }, [searchQuery, selectedSize, sortOrder, pots]);

  const handleAddToCart = (pot) => {
    dispatch(addToCart(pot));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSize("");
    setSortOrder("");
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10 px-4 md:px-8 lg:px-16 pt-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">Available Pots</h1>

        {isAdmin && (
          <div className="text-center mb-6">
            <Link href="/pots/add">
              <button className="cursor-pointer px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm md:text-base">
                Add New Pot
              </button>
            </Link>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative w-full   mb-6">
          <input
            type="text"
            placeholder="Search by name, material, or price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md shadow-sm pr-10 focus:outline-none focus:ring-2 focus:ring-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black text-xl"
              aria-label="Clear"
            >
              &times;
            </button>
          )}
        </div>

        {/* Material Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {["Ceramic", "Plastic", "Terracotta", "Metal", "Concrete", "Wood"].map((material) => (
            <button
              key={material}
              onClick={() => setSearchQuery(material)}
              className="cursor-pointer px-4 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 text-sm"
            >
              {material}
            </button>
          ))}
        </div>

        {/* Size and Sort Dropdowns */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="cursor-pointer border px-3 py-2 rounded-md text-sm shadow-sm"
          >
            <option value="">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="cursor-pointer border px-3 py-2 rounded-md text-sm shadow-sm"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        {/* ✅ Reset Filters Button with Icon */}
        <div className=" flex justify-center mb-8">
          <button
            onClick={resetFilters}
            className="cursor-pointer flex items-center gap-2 px-4 py-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md text-sm"
          >
            <FiRefreshCw className="text-base" />
            Reset Filters
          </button>
        </div>

        {/* Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center ${styles.plantGrid}`}
        >
          {filteredPots.length === 0 ? (
            <p className="col-span-full text-gray-600">No matching pots found.</p>
          ) : (
            filteredPots.map((pot) => (
              <div
                key={pot._id}
                className="bg-white rounded-lg shadow-md flex flex-col w-full max-w-[180px]"
              >
                <img
                  src={pot.imageUrl}
                  alt={pot.name}
                  className="w-full h-36 object-cover rounded-t-lg"
                />
                <div className="p-2 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-green-800">{pot.name}</h2>
                  <div className="flex justify-between text-sm my-1">
                    <span className="text-green-700 font-semibold">₹{pot.price}</span>
                    <span
                      className={`font-medium ${
                        pot.stock ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {pot.stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="grid grid-cols-[2fr_1fr] gap-1 mt-auto">
                    <Link href={`/pots/${pot._id}`} className="w-full">
                      <div className="bg-blue-500 text-white text-center px-2 py-1.5 rounded hover:bg-blue-600 text-sm">
                        View
                      </div>
                    </Link>
                    <button
                      onClick={() => handleAddToCart(pot)}
                      className={`text-sm flex items-center justify-center w-full px-2 py-1.5 rounded ${
                        pot.stock
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-700 cursor-not-allowed"
                      }`}
                      title={pot.stock ? "Add to Cart" : "Out of Stock"}
                      disabled={!pot.stock}
                    >
                      <FaCartPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
