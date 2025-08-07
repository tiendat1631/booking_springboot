import Header from "@/components/shared/Header";
import { Banner, PopularRoutes, SearchBox, Slider } from "./partials";
import Footer from "@/components/shared/Footer.tsx";
export default function Homepage() {
  return (
    <div>
      <Header />
       <Banner />
      <SearchBox />

      <Slider />
      <PopularRoutes />
        <Footer/>
    </div>
  );
}
