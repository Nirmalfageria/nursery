"use client";
import { useRouter } from "next/navigation"; // ✅ Correct import for App Router
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/store/cardSlice";
import Image from "next/image";
import { PlaySquare } from "lucide-react";
const PlantDetailPage = ({ params }) => {
  const { id } = params;
  const dispatch = useDispatch();
  const router = useRouter(); // ✅ from next/navigation
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const cart = useSelector((state) => state.cart);

  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await fetch(`/api/plants/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load plant.");
        }

        const data = await res.json();
        setPlant(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [id]);

  const handleAddToCart = (plant) => {
    dispatch(addToCart(plant));
    alert("Added to the Cart");
    router.push("/plants"); 
  };

  const handleDelete = async (plantId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this plant?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete plant.");

      alert("Plant deleted successfully!");
      router.push("/plants"); // ✅ Correct usage of App Router navigation
    } catch (error) {
      alert("Error deleting plant.");
      console.error(error);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="/temp/5FCA.gif"
          alt="Loading animation"
          className="w-48 h-48 object-contain"
        />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center p-6 max-w-4xl mx-auto pt-15 bg-white">
      <div className="relative rounded-lg shadow-md p-6 flex w-full flex-col md:flex-row ">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src={plant.imageUrl || "/fallback.jpg"}
            alt={plant.name}
            width={300}
            height={300}
            className="object-contain rounded-lg"
            priority
          />
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6">
          <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
          <p className="text-gray-600 mb-2 text-justify">{plant.description}</p>

          <div className="mb-2">
            <span className="text-green-700 text-xl font-bold">
              ₹{plant.price}
            </span>
          </div>

          <p className="text-sm text-gray-500 mb-1">
            Category: {plant.category}
          </p>
          <p className={`text-sm mb-4 ${plant.stock > 0 ? "text-green-500" : "text-red-500"}`}>
            {plant.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          <button
            className={`py-2 px-6 rounded  ${
              plant.stock === 0
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
            }`}
            onClick={() => handleAddToCart(plant)}
            disabled={plant.stock === 0}
          >
            Add to Cart
          </button>

          {isAdmin && (
            <div className="mt-4 flex gap-2">
              <Link href={`/plants/edit/${plant._id}`}>
                <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 cursor-pointer">
                  Edit
                </button>
              </Link>
              <button
                onClick={() => handleDelete(plant._id)}
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

export default PlantDetailPage;
