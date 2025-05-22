"use client";

import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
import Link from "next/link";
import styles from "./plants.module.css";
import { FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from '../../redux/store/cardSlice';
// import { useDispatch } from "react-redux";    
import { useRouter } from "next/navigation";  
export default function PlantsPage() {
  const [plants, setPlants] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.admin.isAdmin);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await fetch("/api/plants");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setPlants(data);
        // console.log(data);
      } catch (err) {
        console.error("Error fetching plants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

   const handleAddToCart = (plant) => {
     dispatch(addToCart(plant));
     alert("Added to the Cart");
     router.push("/plants"); 
   };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="/temp/5FCA.gif"
          alt="Loading animation"
          className="w-48 h-48 object-contain"
        />
      </div>
    );
    
    
    
  
    
  } else {
    return (
      <div className=" bg-white px-4 pt-15">
      <div className="max-w-5xl mx-auto text-center justify-items-center align-center">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Our Plants</h1>

        {isAdmin && (
        <Link href="/plants/add">
          <button className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
          ➕ Add New Plant
          </button>
        </Link>
        )}

        <div
        className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6 rounded-lg justify-items-center px-2 ${styles.plantGrid}`}
        >
        {plants.map((plant) => (
          <div
          key={plant._id}
          className="p-1  justify-items-center flex flex-col text-center w-full max-w-xs bg-white shadow"
          >
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-35 sm:h-40 object-fill rounded-lg"
          />

          <h2 className="text-lg font-semibold text-green-800">
            {plant.name}
          </h2>
          <p className="text-gray-700 font-medium">₹{plant.price}</p>
          <p className={`text-sm ${plant.stock ? "text-green-600" : "text-red-600"}`}>
            {/* {plant.stock} */}
            {plant.stock ? "Available" : "Out of Stock"}
          </p>

          <div className="flex gap-2 w-full mt-1">
            <Link href={`/plants/${plant._id}`} className="w-full">
            <button className="bg-blue-500 text-white w-full px-3 py-1  rounded hover:bg-blue-600 text-sm cursor-pointer">
              View Product
            </button>
            </Link>

            <button
            onClick={() => handleAddToCart(plant)}
            className={`px-3 rounded text-sm flex items-center justify-center  ${
              plant.stock
              ? "bg-green-500 text-white hover:bg-green-600 cursor-pointer"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
            title={plant.stock ? "Add to Cart" : "Out of Stock"}
            disabled={!plant.stock}
            >
            <FaCartPlus className="text-lg" />
            </button>
          </div>
          </div>
        ))}
        </div>
      </div>
      </div>
    );
  }
}
