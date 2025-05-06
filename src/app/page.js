import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16 bg-green-100 text-center">
      <h1 className="text-5xl font-bold text-green-800 mb-6 drop-shadow-md">
        🌱 Welcome to Nursery
      </h1>
      <p className="text-lg text-green-900 max-w-2xl leading-relaxed">
        Discover a wide variety of beautiful and healthy plants to brighten your home and garden. <br />
        Browse our collection, add your favorites to the cart, and enjoy doorstep delivery. <br />
        Happy planting!
      </p>
    </main>
  );
}
