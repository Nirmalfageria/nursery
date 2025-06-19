"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function EditSeedPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const [seed, setSeed] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }

    const fetchSeed = async () => {
      try {
        const res = await fetch(`/api/seeds/${id}`);
        const data = await res.json();
        setSeed(data);
      } catch (error) {
        console.error("Error fetching seed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeed();
  }, [id, isAdmin, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeed((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = seed.imageUrl;

      if (imageFile) {
        // 🗑 Delete old image from Cloudinary
        await fetch("/api/deleteImage", {
          method: "POST",
          body: JSON.stringify({ imageUrl }),
          headers: { "Content-Type": "application/json" },
        });

        // ☁ Upload new image
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const updatedData = { ...seed, imageUrl };

      const res = await fetch(`/api/seeds/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

    //   alert("Seed updated successfully");
      router.push("/seeds");
    } catch (error) {
      console.error("Error updating seed:", error);
      alert("Failed to update seed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !seed) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">✏️ Edit Seed</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <label className="block mb-4">
            Name
            <input
              type="text"
              name="name"
              value={seed.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block mb-4">
            Description
            <textarea
              name="description"
              value={seed.description}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

<label className="block mb-4">
            Price Per Unit
            <input
              type="number" 
              value={seed.pricePerUnit}
              name="pricePerUnit"
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>
          <label className="block mb-4">
            Price Unit
            <select
              name="priceUnit"
              value={seed.priceUnit}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="per gram">Per Gram</option>
              <option value="per kg">Per Kg</option>
              <option value="per seed">Per Seed</option>
              <option value="per packet">Per Packet</option>
            </select>
          </label>

          <label className="block mb-4">
            Category
            <select
              name="category"
              value={seed.category}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="seed.ca">Select</option>
              <option value="fruit">Fruit</option>
              <option value="flower">Flower</option>
              <option value="vegetable">Vegetable</option>
              <option value="herb">Herb</option>
            </select>
          </label>

          <label className="block mb-4">
            Type
            <select
              name="type"
              value={seed.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="Organic">Organic</option>
              <option value="Hybrid">Hybrid</option>
              <option value="GMO">GMO</option>
            </select>
          </label>

          <label className="block mb-4">
            In Stock
            <input
              type="checkbox"
              checked={seed.inStock}
              onChange={(e) => setSeed({ ...seed, inStock: e.target.checked })}
              className="ml-2"
            />
          </label>

          <label className="block mb-4">
            Current Image
            <img src={seed.imageUrl} alt={seed.name} className="w-40 mt-2 rounded" />
          </label>

          <label className="block mb-6">
            Upload New Image (optional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Updating..." : "Update Seed"}
          </button>
        </form>
      </div>
    </div>
  );
}
