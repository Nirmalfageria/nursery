"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function AddSeedPage() {
  const [seed, setSeed] = useState({
    name: "",
    description: "",
    pricePerUnit: "",
    inStock: true,
    imageUrl: "",
    category: "",
    availableTypes: [],
    imageFile: null,
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
    setSeed((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvailableTypesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setSeed((prev) => ({ ...prev, availableTypes: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", seed.imageFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      const res = await fetch("/api/seeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...seed,
          imageUrl,
          imageFile: undefined, // remove before sending
        }),
      });

      if (res.ok) {
        router.push("/seeds");
      } else {
        console.error("Failed to add seed");
      }
    } catch (err) {
      console.error("Error adding seed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-15">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">➕ Add New Seed</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={seed.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={seed.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input
              type="number"
              name="pricePerUnit"
              value={seed.pricePerUnit}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          {/* Stock */}
          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              name="inStock"
              checked={seed.inStock}
              onChange={(e) => setSeed((prev) => ({ ...prev, inStock: e.target.checked }))}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label htmlFor="inStock" className="text-sm font-medium text-gray-700">In Stock</label>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
           <select
  name="category"
  value={seed.category}
  onChange={handleChange}
  required
  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
>
  <option value="">Select Category</option>
  <option value="fruit">Fruit</option>
  <option value="flower">Flower</option>
  <option value="vegetable">Vegetable</option>
  <option value="herb">Herb</option>
</select>

          </div>

          {/* Available Types */}
          <div className="mb-4">
            <label htmlFor="availableTypes" className="block text-sm font-medium text-gray-700">Available Types</label>
            <select
              name="availableTypes"
              // multiple
              value={seed.availableTypes}
              onChange={handleAvailableTypesChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="Organic">Organic</option>
              <option value="Hybrid">Hybrid</option>
              <option value="GMO">GMO</option>
            </select>
            {/* <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple types.</p> */}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSeed((prev) => ({ ...prev, imageFile: e.target.files[0] }))}
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
            {loading ? "Adding..." : "Add Seed"}
          </button>
        </form>
      </div>
    </div>
  );
}
