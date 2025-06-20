"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/store/cardSlice";
import Image from "next/image";

const FertilizerDetailPage = ({ params }) => {
  const { id } = params;
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const [fertilizer, setFertilizer] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFertilizer = async () => {
      try {
        const res = await fetch(`/api/fertilizers/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load fertilizer.");
        }

        const data = await res.json();
        setFertilizer(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizer();
  }, [id]);

  const handleAddToCart = (fertilizer) => {
    dispatch(addToCart(fertilizer));
    alert("Added to the Cart");
    router.push("/fertilizers");
  };

  const handleDelete = async (fertilizerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this fertilizer?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/fertilizers/${fertilizerId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete fertilizer.");

      alert("Fertilizer deleted successfully!");
      router.push("/fertilizers");
    } catch (error) {
      alert("Error deleting fertilizer.");
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
    <div className="flex justify-center items-center p-6 max-w-4xl mx-auto pt-15 bg-white">
      <div className="relative rounded-lg shadow-md p-6 flex w-full flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src={fertilizer.imageUrl || "/fallback.jpg"}
            alt={fertilizer.name}
            width={300}
            height={300}
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6">
          <h1 className="text-2xl font-bold mb-2">{fertilizer.name}</h1>
          <p className="text-gray-600 mb-2 text-justify">{fertilizer.description}</p>

          <div className="mb-2">
            <span className="text-green-700 text-xl font-bold">
              ₹{fertilizer.pricePerUnit}
              <span className="text-sm text-gray-500 ml-1">({fertilizer.priceUnit})</span>
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-1">Category: {fertilizer.category}</p>
          <p
            className={`text-sm mb-4 ${
              fertilizer.inStock ? "text-green-500" : "text-red-500"
            }`}
          >
            {fertilizer.inStock ? "In Stock" : "Out of Stock"}
          </p>

          <button
            className={`py-2 px-6 rounded ${
              fertilizer.inStock
                ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            onClick={() => handleAddToCart(fertilizer)}
            disabled={!fertilizer.inStock}
          >
            Add to Cart
          </button>

          {isAdmin && (
            <div className="mt-4 flex gap-2">
              <Link href={`/fertilizers/edit/${fertilizer._id}`}>
                <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(fertilizer._id)}
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

export default FertilizerDetailPage;
