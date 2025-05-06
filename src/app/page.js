import Image from "next/image";

export default function Home() {
  return (
    <>
     <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-green-50 text-center">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🌱 Welcome to Nursery</h1>
      <p className="text-lg text-gray-700 max-w-xl">
        Discover a wide variety of beautiful and healthy plants to brighten your home and garden. 
        Browse our collection, add your favorites to the cart, and enjoy doorstep delivery. 
        Happy planting!
      </p>
    </main>
    </>
  );
}
