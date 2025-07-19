import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";

interface TimeFrame {
  departureTime: string;
  arrivalTime: string;
}

interface Trip {
  id?: string;
  departure: string;
  destination: string;
  price: number;
  timeFrame: TimeFrame;
  busId: string;
}

interface Bus {
  id: string;
  type: string;
  numberOfSeats: number;
}

const TripManagement: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [form, setForm] = useState<Trip>({
    departure: "",
    destination: "",
    price: 0,
    timeFrame: {
      departureTime: "",
      arrivalTime: "",
    },
    busId: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchTrips = async () => {
    try {
      const res = await axios.get("/trip");
      setTrips(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách chuyến đi", err);
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await axios.get("/bus/all");
      setBuses(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách xe buýt", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "departureTime" || name === "arrivalTime") {
      setForm((prev) => ({
        ...prev,
        timeFrame: {
          ...prev.timeFrame,
          [name]: value,
        },
      }));
    } else if (name === "price") {
      setForm((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
  try {
    setError("");

    const { id, ...formData } = form;

    if (editingId) {
      await axios.put(`/trip/${editingId}`, {
        ...formData,
        tripId: editingId,
      });
    } else {
      await axios.post("/trip", formData);
    }

    setForm({
      departure: "",
      destination: "",
      price: 0,
      timeFrame: {
        departureTime: "",
        arrivalTime: "",
      },
      busId: "",
    });

    setEditingId(null);
    fetchTrips();
  } catch (err) {
    console.error("Lỗi khi lưu chuyến đi:", err);
    setError("Đã xảy ra lỗi khi lưu thông tin chuyến đi.");
  }
};

  const handleEdit = (trip: Trip) => {
    setForm({
      id: trip.id,
      departure: trip.departure ?? "",
      destination: trip.destination ?? "",
      price: trip.price ?? 0,
      busId: trip.busId ?? "",
      timeFrame: {
        departureTime: trip.timeFrame?.departureTime ?? "",
        arrivalTime: trip.timeFrame?.arrivalTime ?? "",
      },
    });
    setEditingId(trip.id!);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá chuyến đi này không?")) {
      try {
        await axios.delete(`/trip/${id}`);
        fetchTrips();
      } catch (err) {
        console.error("Lỗi khi xoá chuyến đi:", err);
      }
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchBuses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý lịch trình</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded mb-6">
        <input
          type="text"
          name="departure"
          placeholder="Điểm đi"
          value={form.departure}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="destination"
          placeholder="Điểm đến"
          value={form.destination}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Giá vé"
          value={form.price}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="busId"
          value={form.busId}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">-- Chọn xe buýt --</option>
          {buses.map((bus) => (
            <option key={bus.id} value={bus.id}>
              {bus.type} ({bus.numberOfSeats} chỗ)
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="departureTime"
          value={form.timeFrame.departureTime}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="arrivalTime"
          value={form.timeFrame.arrivalTime}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="col-span-2 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2 border">Tuyến</th>
            <th className="p-2 border">Giá</th>
            <th className="p-2 border">Thời gian</th>
            <th className="p-2 border">Xe buýt</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {trip.departure} → {trip.destination}
              </td>
              <td className="p-2 border">{trip.price} đ</td>
              <td className="p-2 border">
                {trip.timeFrame?.departureTime ?? "N/A"} → {trip.timeFrame?.arrivalTime ?? "N/A"}
              </td>
              <td className="p-2 border">{trip.busId}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(trip)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(trip.id!)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TripManagement;
