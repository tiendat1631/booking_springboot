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
        fetchBookings(); // refresh sau khi xoá
      } catch (err) {
        console.error("Lỗi khi xoá đơn đặt vé:", err);
        setError("Xoá vé thất bại.");
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý vé</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <table className="w-full border text-sm">
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
              <td className="p-2 border">
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
    </div>
  );
}
