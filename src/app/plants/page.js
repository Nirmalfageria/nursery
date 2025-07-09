"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaCartPlus } from "react-icons/fa";
import { addToCart } from "../../redux/store/cardSlice";
import styles from "./plants.module.css";

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch("/api/plants");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPlants(data);
        setFilteredPlants(data);
      } catch (err) {
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  useEffect(() => {
    let filtered = plants;

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter((plant) =>
        plant.name.toLowerCase().includes(lower) ||
        (plant.category || "").toLowerCase().includes(lower)
      );
    }

    setFilteredPlants(filtered);
  }, [searchTerm, plants]);

  const handleAddToCart = (plant) => {
    dispatch(addToCart(plant));
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-15 bg-white pb-2">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Our Plants</h1>

        {isAdmin && (
          <Link href="/plants/add">
            <button className="cursor-pointer mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Add New Plant
            </button>
          </Link>
        )}

        {/* Search Bar with Clear Button */}
        <div className="relative w-full px-5  mx-auto mb-6">
          <input
            type="text"
            placeholder="Search by name or category..."
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

        {/* Quick Category Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {["Flowering", "Fruit", "Seasonal", "Indoor", "Outdoor"].map((label) => (
            <button
              key={label}
              onClick={() => setSearchTerm(label)}
              className="cursor-pointer  px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200 text-sm"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Filtered Plant Grid */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center ${styles.plantGrid}`}
        >
          {filteredPlants.length === 0 ? (
            <p className="col-span-full text-gray-600">No matching plants found.</p>
          ) : (
            filteredPlants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded-lg shadow-md flex flex-col"
              >
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-45 h-35 sm:h-40 object-fill rounded-lg"
                />

                <h2 className="text-xl font-semibold text-green-800">
                  {plant.name}
                </h2>

                {/* Optional: Show category */}
                <p className="text-gray-600 text-sm">
                  <strong>Category:</strong>{" "}
                  {plant.category
                    ? plant.category.charAt(0).toUpperCase() + plant.category.slice(1)
                    : "Unknown"}
                </p>

                <div className="flex justify-around items-center">
                  <span className="text-green-700 font-bold text-lg">
                    ₹{plant.price}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      plant.stock ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {plant.stock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="grid grid-cols-[2fr_1fr] gap-1 mt-auto">
                  <Link href={`/plants/${plant._id}`} className="w-full">
                    <div className="bg-blue-500 text-white text-center w-full px-1 py-1.5 rounded hover:bg-blue-600 text-sm">
                      View Product
                    </div>
                  </Link>

                  <button
                    onClick={() => handleAddToCart(plant)}
                    className={`cursor-pointer px-1 py-1.5 rounded text-sm flex items-center justify-center w-full ${
                      plant.stock
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-400 text-gray-700 cursor-not-allowed"
                    }`}
                    title={plant.stock ? "Add to Cart" : "Out of Stock"}
                    disabled={!plant.stock}
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
