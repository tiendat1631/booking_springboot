import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainLayout } from "./layouts/MainLayout";
import routeInfo from "./routeInfo";
import Login from "./pages/Login";
import { Homepage } from "./pages";
import AdminLayout from "./pages/Admin/AdminLayout";
import TripManagement from "./pages/Admin/Trip/TripManagement";
import BusManagement from "./pages/Admin/Bus/BusManagement";
import BookingManagement from "./pages/Admin/Booking/BookingManagement";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path={routeInfo.homepage} element={<Homepage />} ></Route>

          </Route>

          <Route path={routeInfo.login} element={<Login />}></Route>
          
          <Route path="/admin" element = {<AdminLayout/>}>
            <Route path="trip" element={<TripManagement/>}></Route>
            <Route path="bus" element={<BusManagement/>}></Route>
            <Route path="booking" element ={<BookingManagement/>}></Route>
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </div >
  );
}
