'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function EditPlantPage() {
  const [plant, setPlant] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const isAdmin = useSelector((state) => state.admin.isAdmin);
  const router = useRouter();
  const { id } = useParams();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) router.push('/');
  }, [isAdmin, router]);

  // Fetch existing plant data
  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const res = await fetch(`/api/plants/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPlant(data);
        } else {
          console.error('Failed to fetch plant data');
        }
      } catch (err) {
        console.error('Error fetching plant:', err);
      }
    };

    if (id) fetchPlant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = plant.imageUrl;

      // If a new image is selected, upload it
      if (plant.imageFile) {
        const formData = new FormData();
        formData.append('file', plant.imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Image upload failed');
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      // Update plant data
      const res = await fetch(`/api/plants/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...plant,
          imageFile: undefined,
          imageUrl,
        }),
      });

      if (res.ok) {
        router.push('/plants');
      } else {
        console.error('Failed to update plant');
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 pt-15">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">✏️ Edit Plant</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plant Name</label>
            <input type="text" id="name" name="name" value={plant.name} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" value={plant.description} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
            <input type="number" id="price" name="price" value={plant.price} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input type="number" id="stock" name="stock" value={plant.stock} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload New Image</label>
            <input type="file" id="image" accept="image/*" onChange={(e) => setPlant((prev) => ({ ...prev, imageFile: e.target.files[0] }))} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded" />
            {plant.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <img src={plant.imageUrl} alt="Plant" className="h-32 rounded" />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select id="category" name="category" value={plant.category} onChange={handleChange} required className="w-full mt-1 px-3 py-2 border border-gray-300 rounded">
              <option value="">Select a category</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruit">Fruit</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? 'Updating...' : 'Update Plant'}
          </button>
        </form>
      </div>
    </div>
  );
}
