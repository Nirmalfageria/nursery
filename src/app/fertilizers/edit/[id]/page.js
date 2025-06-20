"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function EditFertilizerPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  const [fertilizer, setFertilizer] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }

    const fetchFertilizer = async () => {
      try {
        const res = await fetch(`/api/fertilizers/${id}`);
        const data = await res.json();
        setFertilizer(data);
      } catch (error) {
        console.error("Error fetching fertilizer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFertilizer();
  }, [id, isAdmin, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFertilizer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = fertilizer.imageUrl;

      if (imageFile) {
        await fetch("/api/deleteImage", {
          method: "POST",
          body: JSON.stringify({ imageUrl }),
          headers: { "Content-Type": "application/json" },
        });

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

      const updatedData = { ...fertilizer, imageUrl };

      const res = await fetch(`/api/fertilizers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Update failed");

      router.push("/fertilizers");
    } catch (error) {
      console.error("Error updating fertilizer:", error);
      alert("Failed to update fertilizer.");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !fertilizer) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">✏️ Edit Fertilizer</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <label className="block mb-4">
            Name
            <input
              type="text"
              name="name"
              value={fertilizer.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block mb-4">
            Description
            <textarea
              name="description"
              value={fertilizer.description}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block mb-4">
            Price Per Unit
            <input
              type="number"
              name="pricePerUnit"
              value={fertilizer.pricePerUnit}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </label>

          <label className="block mb-4">
            Price Unit
            <select
              name="priceUnit"
              value={fertilizer.priceUnit}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="per gram">Per Gram</option>
              <option value="per kg">Per Kg</option>
              <option value="per ml">Per mL</option>
              <option value="per litre">Per Litre</option>
            </select>
          </label>

          <label className="block mb-4">
            Category
            <select
              name="category"
              value={fertilizer.category}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select</option>
              <option value="organic">Organic</option>
              <option value="chemical">Chemical</option>
              <option value="bio">Bio-Fertilizer</option>
            </select>
          </label>

          <label className="block mb-4">
            In Stock
            <input
              type="checkbox"
              checked={fertilizer.inStock}
              onChange={(e) =>
                setFertilizer({ ...fertilizer, inStock: e.target.checked })
              }
              className="ml-2"
            />
          </label>

          <label className="block mb-4">
            Current Image
            <img src={fertilizer.imageUrl} alt={fertilizer.name} className="w-40 mt-2 rounded" />
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
            {loading ? "Updating..." : "Update Fertilizer"}
          </button>
        </form>
      </div>
    </div>
  );
}
