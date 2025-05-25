"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { FaCartPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { addToCart } from "../../redux/store/cardSlice";
import styles from "../plants/plants.module.css";
export default function PotsPage() {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Failed to fetch pots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPots();
  }, []);

  const handleAddToCart = (pot) => {
    dispatch(addToCart(pot));
    alert("Added to the Cart");
    router.push("/pots");
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-15 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-8">
          🪴 Available Pots
        </h1>

        {isAdmin && (
          <Link href="/pots/add">
            <button className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
              ➕ Add New Pot
            </button>
          </Link>
        )}

        <div
          className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg justify-items-center ${styles.plantGrid}`}
        >
          {pots.map((pot) => (
            <div
              key={pot._id}
              className="bg-white rounded-lg shadow-md  flex flex-col"
            >
              <img
                src={pot.imageUrl}
                alt={pot.name}
                className="w-full h-35 sm:h-40 object-fill rounded-lg"
              />

              <h2 className="text-xl font-semibold text-green-800 mb-1">
                {pot.name}
              </h2>

              <p className="text-gray-600 text-sm ">
                <strong>Size:</strong> {pot.size}
              </p>

              <div className="flex justify-around items-center mb-2">
                <span className="text-green-700 font-bold text-lg">
                  ₹{pot.price}
                </span>
                <span
                  className={`text-sm font-medium ${pot.stock ? "text-green-600" : "text-red-500"}`}
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
                  className={`px-1 py-1.5 rounded text-sm flex items-center justify-center w-full ${
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
          ))}
        </div>
      </div>
    </div>
  );
}
