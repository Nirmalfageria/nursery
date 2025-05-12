'use client';
import { useRouter } from 'next/navigation'; // ✅ Correct import for App Router
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../../redux/store/cardSlice';

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
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to load plant.');
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
    alert('Added to the Cart');
  };

  const handleDelete = async (plantId) => {
    const confirmed = window.confirm('Are you sure you want to delete this plant?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/plants/${plantId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete plant.');

      alert('Plant deleted successfully!');
      router.push('/plants'); // ✅ Correct usage of App Router navigation
    } catch (error) {
      alert('Error deleting plant.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 border-b-4"></div>
      </div>
    );}


  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto pt-15">
      <div className="relative rounded-lg shadow-md p-6 flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-[300px] object-contain"
          />
        </div>
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-6">
          <h1 className="text-2xl font-bold mb-2">{plant.name}</h1>
          <p className="text-gray-600 mb-2">{plant.description}</p>

          <div className="mb-2">
            <span className="text-green-700 text-xl font-bold">₹{plant.price}</span>
          </div>

          <p className="text-sm text-gray-500 mb-1">Category: {plant.category}</p>
          <p className="text-sm text-gray-500 mb-4">In stock: {plant.stock}</p>

          <button
            className="bg-green-700 text-white py-2 px-6 rounded hover:bg-green-800 cursor-pointer"
            onClick={() => handleAddToCart(plant)}
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
