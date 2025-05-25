"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { addToCart } from "../../../redux/store/cardSlice";

const PotDetailPage = ({ params }) => {
  const { id } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const [pot, setPot] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPot = async () => {
      try {
        const res = await fetch(`/api/pots/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to load pot");

        const data = await res.json();
        setPot(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPot();
  }, [id]);

  const handleAddToCart = (pot) => {
    dispatch(addToCart(pot));
    alert("Added to the Cart");
    router.push("/pots");
  };

  const handleDelete = async (potId) => {
    const confirmed = window.confirm("Are you sure you want to delete this pot?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/pots/${potId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete pot.");

      alert("Pot deleted successfully!");
      router.push("/pots");
    } catch (error) {
      alert("Error deleting pot.");
      console.error(error);
    }
  };
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center p-6 max-w-4xl mx-auto pt-15">
      <div className="relative rounded-lg shadow-md p-6 flex w-full flex-col md:flex-row ">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src={pot.imageUrl || "/fallback.jpg"}
            alt={pot.name}
            width={300}
            height={300}
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6">
          <h1 className="text-2xl font-bold mb-2">{pot.name}</h1>
          <p className="text-gray-600 mb-2 text-justify">{pot.description}</p>

          <div className="mb-2">
            <span className="text-green-700 text-xl font-bold">
              ₹{pot.price}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-1">Material: {pot.material}</p>
          <p className="text-sm text-gray-500 mb-1">Size: {pot.size}</p>
          <p className={`text-sm mb-4 ${pot.stock > 0 ? "text-green-500" : "text-red-500"}`}>
            {pot.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button
            className={`py-2 px-6 rounded  ${
              pot.stock === 0
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
            }`}
            onClick={() => handleAddToCart(pot)}
            disabled={pot.stock === 0}
          >
            Add to Cart
          </button>

          {isAdmin && (
            <div className="mt-4 flex gap-2">
              <Link href={`/pots/edit/${pot._id}`}>
                <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(pot._id)}
                className="cursor-pointer px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PotDetailPage;
