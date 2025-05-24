"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function GardeningServices() {
  const router = useRouter();
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const [date, setDate] = useState();
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
  });

  const isAdmin = useSelector((state) => state.admin.isAdmin);

  // Single common loading state
  // Can be null, "services", "booking", "addService", or serviceId string for deletion
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading("services");
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      alert("Failed to fetch services.");
    } finally {
      setLoading(null);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!serviceId || !address || !date) {
      alert("Please select a service, address, and date.");
      return;
    }

    const selected = services.find((s) => s._id === serviceId);
    if (!selected) {
      alert("Selected service not found.");
      return;
    }

    if (new Date(date) <= new Date()) {
      alert("Please select a date later than today.");
      return;
    }

    setLoading("booking");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId, address, date }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (
          data.message === "Unauthorized" ||
          data.message === "Invalid session" ||
          data.message === "User not logged in" ||
          data.message === "Please login first"
        ) {
          alert("Please login first.");
          router.push("/login");
          return;
        }
        alert(data.message || "Failed to book service.");
        return;
      }

      if (data.success) {
        alert("Service booked successfully!");
        setAddress({ street: "", city: "", state: "", pinCode: "" });
        setDate("");
        setServiceId("");
      } else {
        alert(data.message || "Failed to book service.");
      }
    } catch (error) {
      alert("Network error, please try again.");
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleAddService = async () => {
    if (!newService.name || !newService.price) return;

    setLoading("addService");
    try {
      await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newService),
      });
      await fetchServices();
      setNewService({ name: "", price: "", description: "" });
      alert("Service added/updated!");
    } catch {
      alert("Failed to add/update service.");
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    setLoading(id);
    try {
      await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      alert("Service deleted!");
      await fetchServices();
    } catch {
      alert("Failed to delete service.");
    } finally {
      setLoading(null);
    }
  };
if(loading){
  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <img
        src="/temp/5FCA.gif"
        alt="Loading animation"
        className="w-48 h-48 object-contain"
      />
    </div>
)}
  return (
    <div className="min-h-screen bg-green-700 text-white pt-20 px-4 pb-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          🌿 Gardening Services
        </h1>
        <p className="mb-8 text-lg text-center">
          Let us help you create and maintain a beautiful green space.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Services Offered</h2>

          {loading === "services" ? (
            <p>Loading services...</p>
          ) : (
            <ul className="list-disc list-inside space-y-3">
              {services.map((s) => (
                <li
                  key={s._id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold">{s.name}:</span> ₹{s.price} –{" "}
                    {s.description}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteService(s._id)}
                      className="cursor-pointer ml-4 p-1 rounded hover:bg-red-700"
                      aria-label={`Delete service ${s.name}`}
                      title={`Delete service ${s.name}`}
                      disabled={loading === s._id}
                    >
                      {loading === s._id ? (
                        <span>Deleting...</span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-600 hover:text-red-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7L5 7M6 7L6 19a2 2 0 002 2h8a2 2 0 002-2V7M10 11v6M14 11v6M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white text-green-900 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">Book a Service</h2>

          <form onSubmit={handleBooking} className="space-y-4">
            <select
              className="w-full p-2 border border-green-300 rounded"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                const selected = services.find((s) => s._id === e.target.value);
                setEstimatedCost(selected ? selected.price : null);
              }}
              required
              disabled={loading === "booking"}
            >
              <option value="">-- Choose a service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              className="w-full p-2 border border-green-300 rounded"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
              required
              disabled={loading === "booking"}
            />

            <input
              type="text"
              className="w-full p-2 border border-green-300 rounded"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
              disabled={loading === "booking"}
            />

            <input
              type="text"
              className="w-full p-2 border border-green-300 rounded"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              required
              disabled={loading === "booking"}
            />

            <input
              type="text"
              className="w-full p-2 border border-green-300 rounded"
              placeholder="Pin Code"
              value={address.pinCode}
              onChange={(e) =>
                setAddress({ ...address, pinCode: e.target.value })
              }
              required
              disabled={loading === "booking"}
            />
            <input
              type="date"
              className="w-full p-2 border border-green-300 rounded "
              value={date}
              min={minDate}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={loading === "booking"}
            />

            <button
              type="submit"
              className="cursor-pointer bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50"
              disabled={loading === "booking"}
            >
              {loading === "booking" ? "Booking..." : "Book Now"}
            </button>

            {estimatedCost !== null && (
              <p className="mt-4 font-semibold text-green-800">
                Estimated Cost: ₹{estimatedCost}
              </p>
            )}
          </form>
        </section>

        {isAdmin && (
          <section className="bg-white text-green-900 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">
              Add / Update Service (Admin)
            </h2>
            <input
              className="w-full p-2 border mb-2"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
              disabled={loading === "addService"}
            />
            <input
              className="w-full p-2 border mb-2"
              placeholder="Price"
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService({ ...newService, price: e.target.value })
              }
              disabled={loading === "addService"}
            />
            <input
              className="w-full p-2 border mb-2"
              placeholder="Description"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
              disabled={loading === "addService"}
            />
            <button
              onClick={handleAddService}
              className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700 disabled:opacity-50"
              disabled={loading === "addService"}
            >
              {loading === "addService" ? "Saving..." : "Save Service"}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
