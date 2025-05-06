"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/store/cardSlice"; // Import the action for adding to cart

export default function Plants() {
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); // Use dispatch from Redux

  // Fetch plant data
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://perenual.com/api/v2/species-list?key=sk-MTHv6801f098a38c19874"
        );
        const data = await response.json();

        if (Array.isArray(data.data)) {
          setPlants(data.data); // Set plants state
        } else {
          setError("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch plants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Add to cart function
  const handleAddToCart = (plant) => {
    const itemWithPrice = {
      ...plant,
      price: plant.id * 10, // ✅ consistent price logic
      quantity: 1,
    };

    dispatch(addToCart(itemWithPrice));
    alert(`${plant.common_name || "Plant"} added to cart!`);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {plants.map((plant) => (
        <div
          key={plant.id}
          className="bg-green-50 p-3 rounded-md shadow hover:shadow-lg transition"
        >
          {plant.default_image?.medium_url ? (
            <img
              src={plant.default_image.medium_url}
              alt={plant.common_name || "Plant image"}
              className="w-full h-40 object-cover rounded"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 rounded">
              No Image
            </div>
          )}

          <h3 className="text-xl font-semibold mt-2 text-green-500">
            {plant.common_name || "No Name"}
          </h3>
          <p className="text-gray-600 italic">{plant.scientific_name?.[0]}</p>
          <p className="text-green-700 font-bold mt-1">₹{plant.id * 10}</p>

          <button
            onClick={() => handleAddToCart(plant)} // Add to cart on click
            className="mt-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </main>
  );
}
