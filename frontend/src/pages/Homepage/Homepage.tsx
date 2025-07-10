import SearchBox from './partials/SearchBox'
import Header from "@/components/ui/Header.tsx";
import Banner from "@/components/ui/Banner.tsx";
import Slider from "@/components/ui/Slider.tsx";
import PopularRoutes from "@/components/ui/PopularRoutes.tsx";
export default function Homepage() {
  return (
      <div>
        <Header />
          <Banner/>
        <SearchBox />
          <Slider />
          <PopularRoutes />
      </div>

  )
}
