import SearchBox from './partials/SearchBox'
import Header from "@/components/ui/Header.tsx";
import Banner from "@/components/ui/Banner.tsx";
import Slider from "@/components/ui/Slider.tsx";
import PopularRoutes from "@/components/ui/PopularRoutes.tsx";
import FutaHighlights from "@/components/ui/FutaHighlights.tsx";
import Footer from "@/components/ui/Footer.tsx";
export default function Homepage() {
  return (
      <div>
        <Header />
          <Banner/>
        <SearchBox />
          <Slider />
          <PopularRoutes />
          <FutaHighlights/>
          <Footer/>
      </div>

  )
}
