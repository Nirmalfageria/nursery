"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function EditPotPage() {
  const [pot, setPot] = useState({
    name: "",
    description: "",
    price: "",
    stock: true,
    imageUrl: "",
    material: "",
    size: "",
  });

  const [loading, setLoading] = useState(false);
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const router = useRouter();
  const { id } = useParams();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) router.push("/");
  }, [isAdmin, router]);

  // Fetch existing pot data
  useEffect(() => {
    const fetchPot = async () => {
      try {
        const res = await fetch(`/api/pots/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPot(data);
        } else {
          console.error("Failed to fetch pot data");
        }
      } catch (err) {
        console.error("Error fetching pot:", err);
      }
    };

    if (id) fetchPot();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPot((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = pot.imageUrl;

      if (pot.imageFile) {
        const formData = new FormData();
        formData.append("file", pot.imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const res = await fetch(`/api/pots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pot,
          imageFile: undefined,
          imageUrl,
        }),
      });

      if (res.ok) {
        router.push("/pots");
      } else {
        console.error("Failed to update pot");
      }
    } catch (err) {
      console.error("Error:", err);
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
        <h1 className="text-3xl font-bold text-green-700 mb-6">✏️ Edit Pot</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Pot Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={pot.name}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={pot.description}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={pot.price}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700"
            >
              In Stock
            </label>
            <input
              type="checkbox"
              id="stock"
              name="stock"
              checked={pot.stock}
              onChange={(e) => setPot({ ...pot, stock: e.target.checked })}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload New Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) =>
                setPot((prev) => ({ ...prev, imageFile: e.target.files[0] }))
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            />
            {pot.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img src={pot.imageUrl} alt="Pot" className="h-32 rounded" />
              </div>
            )}
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
              id="material"
              name="material"
              value={pot.material}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select material</option>
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
              id="size"
              name="size"
              value={pot.size}
              onChange={handleChange}
              required
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded"
            >
              <option value="">Select size</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Update Pot"}
          </button>
        </form>
      </div>
    </div>
  );
}
