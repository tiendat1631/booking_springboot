import { Route, Routes } from "react-router";
import { Homepage, Welcome } from "@/pages";
import routeInfo from "./routeInfo";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path={routeInfo.homepage} element={<Homepage />} />
        <Route path={routeInfo.welcome} element={<Welcome />} />
      </Routes>
    </div>
  );
}
