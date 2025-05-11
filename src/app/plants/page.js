'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';

export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  // Fetch all plants
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('/api/plants');
        const data = await res.json();
        setPlants(data);
      } catch (err) {
        console.error('Error fetching plants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Delete plant
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;
    try {
      const res = await fetch(`/api/plants/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        
      });

      if (res.ok) {
        setPlants((prev) => prev.filter(p => p._id !== id));
      } else {
        console.error("Delete failed with status:", res.status);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading plants...</p>;

  return (
    <div className="min-h-screen bg-white p-4 pt-15">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-6">🌿 Our Plants</h1>

        {isAdmin && (
          <Link href="/plants/add">
            <button className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              ➕ Add New Plant
            </button>
          </Link>
        )}

        <div className="grid md:grid-cols-6 sm:grid-cols-4 gap-6">
          {plants.map((plant) => (
            <div key={plant._id} className="bg-white border border-gray-200 pb-1 rounded shadow">
              <img
                src={plant.imageUrl}
                alt={plant.name}
                className="w-full h-40 object-contain"
              />
              <h2 className="text-xl font-semibold text-green-800">{plant.name}</h2>
              <p className="text-sm text-gray-600">{plant.description}</p>
              <p className="mt-1 font-medium text-gray-800">₹{plant.price}</p>
              <p className="text-xs text-gray-500">Stock: {plant.stock}</p>

              {isAdmin && (
                <div className="mt-3 flex gap-2">
                  <Link href={`/plants/edit/${plant._id}`}>
                    <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      Edit
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDelete(plant._id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
