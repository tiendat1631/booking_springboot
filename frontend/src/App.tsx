import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Welcome from './pages/Welcome';
import AdminLayout from './pages/Admin/AdminLayout';
import TripManagement from './pages/Admin/Trip/TripManagement';
import BusManagement from './pages/Admin/Bus/BusManagement';
import BookingManagement from './pages/Admin/Booking/BookingManagement';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Chỉ hiển thị NavBar nếu không phải trang admin */}
      <Routes>
        <Route
          path="/admin/*"
          element={<AdminLayout />}
        >
          <Route index element={<TripManagement />} />
          <Route path="trip" element={<TripManagement />} />
          <Route path="bus" element={<BusManagement />} />
          <Route path="booking" element={<BookingManagement />} />
        </Route>

        {/* Welcome pages */}
        <Route
          path="*"
          element={
            <>
              <NavBar />
              <main className="grow flex">
                <Routes>
                  <Route path="/" element={<Welcome />} />
                </Routes>
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}
