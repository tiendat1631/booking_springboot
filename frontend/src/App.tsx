import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styles from "./App.module.css";
import Footer from "./layouts/Footer";
import NavBar from "./layouts/NavBar";
import NotFound from "./layouts/NotFound";
import Homepage from "./pages/Homepage";
import Welcome from "./pages/Welcome";

export default function App() {
  return (
    <Router>
      <MantineProvider>
        <div className={styles.app}>
          <NavBar />
          <div className={styles.content}>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </MantineProvider>
    </Router>
  );
}
