'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styles from './plants.module.css';
export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch('/api/plants');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this plant?")) return;
    try {
      const res = await fetch(`/api/plants/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Delete failed with status ${res.status}`);
      setPlants((prev) => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-b-4"></div>
      </div>
    );}
else{
  return (
    <div className="min-h-screen bg-white  px-4 pt-15">
      <div className="max-w-4xl mx-auto text-center justify-items-center align-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Our Plants</h1>

        {isAdmin && (
          <Link href="/plants/add">
            <button className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer  ">
              ➕ Add New Plant
            </button>
          </Link>
        )}

        <div className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg justify-items-center ${styles.plantGrid}`}>
          {plants.map((plant) => (
            <div key={plant._id} className="p-1  justify-items-center flex flex-col text-center w-full max-w-xs bg-white shadow">
            <img src={plant.imageUrl} alt={plant.name} className="w-full h-35 sm:h-40 object-fill rounded-lg" />

              <h2 className="text-lg font-semibold text-green-800">{plant.name}</h2>
              <p className="text-gray-700 font-medium">₹{plant.price}</p>
              
              <Link href={`/plants/${plant._id}`}>
                <button className="bg-blue-500 text-white w-full px-4 py-1 cursor-pointer  rounded hover:bg-blue-600 text-sm">
                  View Product
                </button>
              </Link>

              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
}