import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/Admin/AdminLayout";
import TripManagement from "./pages/Admin/Trip/TripManagement";
import BusManagement from "./pages/Admin/Bus/BusManagement";
import BookingManagement from "./pages/Admin/Booking/BookingManagement";
import TicketLookup from "@/pages/Lookup/TicketLookup.tsx";
import { Homepage, Welcome } from "@/pages";
import routeInfo from "./routeInfo";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<TripManagement />} />
          <Route path="trip" element={<TripManagement />} />
          <Route path="bus" element={<BusManagement />} />
          <Route path="booking" element={<BookingManagement />} />
        </Route>
        <Route path="/ticket-lookup" element={<TicketLookup />} />
        <Route path={routeInfo.homepage} element={<Homepage />} />
        <Route path={routeInfo.welcome} element={<Welcome />} />
      </Routes>
    </div>
  );
}
