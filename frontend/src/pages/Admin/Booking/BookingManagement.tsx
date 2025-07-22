import React, { useEffect, useState } from "react";
import axios from "@/utils/axiosInstance";

interface Booking {
  id: string;
  total: number;
  timeCreate: string;
  userId: string;
  tripId: string;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<Booking | null>(null);
  const [form, setForm] = useState({ tripId: "", total: "" });

  // const [isCreating, setIsCreating] = useState(false);
  // const [newBooking, setNewBooking] = useState({
  //   userId: "",
  //   tripId: "",
  //   seatIds: "",
  // });

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/booking/all");
      setBookings(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách vé:", err);
      setError("Không thể tải danh sách vé.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá đơn đặt vé này không?")) {
      try {
        await axios.delete(`/booking/${id}`);
        fetchBookings();
      } catch (err) {
        console.error("Lỗi khi xoá đơn đặt vé:", err);
        setError("Xoá vé thất bại.");
      }
    }
  };

  const openEditModal = (booking: Booking) => {
    setEditing(booking);
    setForm({ tripId: booking.tripId, total: booking.total.toString() });
  };

  const handleUpdate = async () => {
    if (!editing) return;
    try {
      await axios.put(`/booking/${editing.id}`, {
        tripId: form.tripId,
        total: parseFloat(form.total),
      });
      setEditing(null);
      fetchBookings();
    } catch (err) {
      console.error("Lỗi khi cập nhật đơn:", err);
      setError("Cập nhật đơn thất bại.");
    }
  };

  // const handleCreate = async () => {
  //   try {
  //     await axios.post("/booking", {
  //       userId: newBooking.userId,
  //       tripId: newBooking.tripId,
  //       seatIds: newBooking.seatIds
  //         .split(",")
  //         .map((id) => id.trim())
  //         .filter((id) => id.length > 0),
  //     });

  //     setIsCreating(false);
  //     setNewBooking({ userId: "", tripId: "", seatIds: "" });
  //     fetchBookings();
  //   } catch (err) {
  //     console.error("Lỗi khi thêm booking:", err);
  //     setError("Tạo đơn đặt vé thất bại.");
  //   }
  // };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý vé</h1>

        {/*
        <button
          onClick={() => setIsCreating(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Thêm đơn đặt vé
        </button>
        */}
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <table className="w-full border text-sm mb-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Mã người dùng</th>
            <th className="p-2 border">Mã chuyến</th>
            <th className="p-2 border">Ngày đặt</th>
            <th className="p-2 border">Tổng tiền</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="p-2 border">{b.userId}</td>
              <td className="p-2 border">{b.tripId}</td>
              <td className="p-2 border">{new Date(b.timeCreate).toLocaleString()}</td>
              <td className="p-2 border">{b.total.toLocaleString()} VND</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Huỷ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal sửa */}
      {editing && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Cập nhật đơn đặt vé</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">Trip ID</label>
                <input
                  type="text"
                  value={form.tripId}
                  onChange={(e) =>
                    setForm({ ...form, tripId: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Tổng tiền</label>
                <input
                  type="number"
                  value={form.total}
                  onChange={(e) =>
                    setForm({ ...form, total: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditing(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm – hiện đang bị comment lại */}
      {/*
      {isCreating && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Tạo đơn đặt vé mới</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium">User ID</label>
                <input
                  type="text"
                  value={newBooking.userId}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, userId: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">Trip ID</label>
                <input
                  type="text"
                  value={newBooking.tripId}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, tripId: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block font-medium">
                  Danh sách Seat ID (cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="uuid1, uuid2, uuid3"
                  value={newBooking.seatIds}
                  onChange={(e) =>
                    setNewBooking({ ...newBooking, seatIds: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Huỷ
                </button>
                <button
                  onClick={handleCreate}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      */}
    </div>
  );
}
