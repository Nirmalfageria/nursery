"use client";
import { useState } from "react";

export default function GardeningServices() {
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(null);

  const services = {
    "Garden Setup": 2000,
    "Garden Cutting & Trimming": 1000,
    "Planting Assistance": 800,
    "Maintenance Package": 1500,
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (service && address && date) {
      setEstimatedCost(services[service]);
    }
  };

  return (
    <div className="min-h-screen bg-green-700 text-white pt-20 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🌿 Gardening Services
        </h1>

        <p className="mb-8 text-lg text-center">
          Let us help you create and maintain a beautiful green space. Our experienced
          gardeners are here to serve you.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>
          <ul className="list-disc list-inside space-y-3">
            <li>
              <span className="font-bold">🌿 Garden Setup:</span> Complete landscaping and plant placement
            </li>
            <li>
              <span className="font-bold">✂️ Garden Cutting & Trimming:</span> Regular or one-time trimming and maintenance
            </li>
            <li>
              <span className="font-bold">🌱 Planting Assistance:</span> We’ll plant selected plants for you at your home or office
            </li>
            <li>
              <span className="font-bold">📅 Maintenance Packages:</span> Weekly/Monthly garden care subscriptions
            </li>
          </ul>
        </section>

        <section className="bg-white text-green-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Book a Service</h2>
          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Select Service</label>
              <select
                className="w-full p-2 border border-green-300 rounded"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
              >
                <option value="">-- Choose a service --</option>
                {Object.keys(services).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Address</label>
              <input
                type="text"
                className="w-full p-2 border border-green-300 rounded"
                placeholder="Your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Preferred Date</label>
              <input
                type="date"
                className="w-full p-2 border border-green-300 rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Book Now
            </button>

            {estimatedCost !== null && (
              <p className="mt-4 font-semibold text-green-800">
                Estimated Cost: ₹{estimatedCost}
              </p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
