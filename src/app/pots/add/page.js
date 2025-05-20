"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AddPotPage() {
  const [pot, setPot] = useState({
    name: "",
    description: "",
    price: "",
    stock: true,
    imageUrl: "",
    category: "",
    material: "",
    size: "",
  });
  const [loading, setLoading] = useState(false);
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPot((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", pot.imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Image upload failed");
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Create the pot
      const res = await fetch("/api/pots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pot,
          imageUrl,
          imageFile: undefined,
        }),
      });

      if (res.ok) {
        router.push("/pots");
      } else {
        console.error("Failed to add pot");
      }
    } catch (err) {
      console.error("Error adding pot:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-b-4"></div>
      </div>
    );
  } 
  return (
    <div className="min-h-screen bg-white p-4 pt-15">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">
          ➕ Add New Pot
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={pot.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              value={pot.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={pot.price}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Stock */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="stock"
              name="stock"
              checked={pot.stock}
              onChange={(e) =>
                setPlant((prev) => ({ ...prev, stock: e.target.checked }))
              }
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label
              htmlFor="stock"
              className="text-sm font-medium text-gray-700"
            >
              In Stock
            </label>
          </div>

          {/* Material */}
          <div className="mb-4">
            <label
              htmlFor="material"
              className="block text-sm font-medium text-gray-700"
            >
              Material
            </label>
            <select
              name="material"
              value={pot.material}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Material</option>
              <option value="Ceramic">Ceramic</option>
              <option value="Plastic">Plastic</option>
              <option value="Terracotta">Terracotta</option>
              <option value="Metal">Metal</option>
              <option value="Concrete">Concrete</option>
              <option value="Wood">Wood</option>
            </select>
          </div>

          {/* Size */}
          <div className="mb-4">
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-700"
            >
              Size
            </label>
            <select
              name="size"
              value={pot.size}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select Size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

        

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPot((prev) => ({ ...prev, imageFile: e.target.files[0] }))
              }
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Adding..." : "Add Pot"}
          </button>
        </form>
      </div>
    </div>
  );
}
