import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";

interface Bus {
  id?: string;
  type: "normal" | "limousine";
  numberOfSeats: number;
}

const BusManagement: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [form, setForm] = useState<Bus>({
    type: "normal",
    numberOfSeats: 40,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchBuses = async () => {
    try {
      const res = await axios.get("/bus/all");
      setBuses(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách xe buýt:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "type") {
      const selectedType = value as "normal" | "limousine";
      const defaultSeats = selectedType === "normal" ? 40 : 22;
      setForm((prev) => ({
        ...prev,
        type: selectedType,
        numberOfSeats: defaultSeats,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setError("");
      if (editingId) {
        await axios.put(`/bus/${editingId}`, form);
      } else {
        await axios.post("/bus", { busType: form.type });
      }

      setForm({
        type: "normal",
        numberOfSeats: 40,
      });
      setEditingId(null);
      fetchBuses();
    } catch (err) {
      console.error("Lỗi khi lưu xe buýt:", err);
      setError("Đã xảy ra lỗi khi lưu thông tin xe buýt.");
    }
  };

  const handleEdit = (bus: Bus) => {
    setForm({
      id: bus.id,
      type: bus.type,
      numberOfSeats: bus.numberOfSeats,
    });
    setEditingId(bus.id!);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá xe buýt này không?")) {
      try {
        await axios.delete(`/bus/${id}`);
        fetchBuses();
      } catch (err) {
        console.error("Lỗi khi xoá xe buýt:", err);
      }
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý xe buýt</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* FORM */}
      <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded mb-6">
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="normal">Xe thường (40 chỗ)</option>
          <option value="limousine">Limousine (22 chỗ)</option>
        </select>

        <input
          type="number"
          name="numberOfSeats"
          value={form.numberOfSeats}
          disabled
          className="p-2 border rounded bg-gray-200"
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
            <th className="p-2 border">Loại xe</th>
            <th className="p-2 border">Số ghế</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id} className="hover:bg-gray-50">
              <td className="p-2 border capitalize">{bus.type}</td>
              <td className="p-2 border">{bus.numberOfSeats}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(bus)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(bus.id!)}
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

export default BusManagement;
