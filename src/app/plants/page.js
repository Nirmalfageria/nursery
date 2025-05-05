'use client'
import { useEffect, useState } from 'react';

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchPlants = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('https://perenual.com/api/v2/species-list?key=sk-MTHv6801f098a38c19874'); 
        if (!response.ok) {
          throw new Error('Failed to fetch plant data');
        }
        const data = await response.json();
        
        console.log('API response:', data); // Debug: Log the whole API response

        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setPlants(data.data); // Set the plant data correctly
          console.log('Plants data:', data.data); // Debug: Log the plant data
        } else {
          setError('No plant data available');
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
        setError('Failed to load plants');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const addToCart = (plant) => {
    setCart((prevCart) => {
      // Check if the plant is already in the cart
      const existingPlant = prevCart.find((item) => item.id === plant.id);
      if (existingPlant) {
        // If the plant is already in the cart, increment the quantity
        return prevCart.map((item) =>
          item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If it's not in the cart, add the plant to the cart with quantity 1
        return [...prevCart, { ...plant, quantity: 1 }];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600 border-b-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {plants.length > 0 ? (
        plants.map((plant) => (
          <div
            key={plant.id}
            className="bg-white p-3 rounded-lg shadow hover:shadow-md transition transform hover:scale-105"
          >
            <img 
              src={plant.default_image?.medium_url} 
              alt={plant.common_name} 
              className="w-full h-48 object-cover rounded-t-lg" 
            />
            <h3 className="font-semibold text-lg mt-4 text-green-800">{plant.common_name}</h3>
            <p className="text-sm text-gray-500">{plant.scientific_name.join(', ')}</p>
            <p className="text-sm text-gray-500">Family: {plant.family || 'Not available'}</p>
            <p className="text-sm text-gray-500">Cultivar: {plant.cultivar || 'Not available'}</p>
            <p className="text-xl font-semibold text-green-700 mt-2">${plant.price || 'Price not available'}</p>

            {/* Add to Cart Button */}
            <button 
              onClick={() => addToCart(plant)} 
              className="w-full mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))
      ) : (
        <div>No plants found</div>
      )}
    </main>
  );
}
