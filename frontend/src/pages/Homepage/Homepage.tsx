import { Banner, PopularRoutes, SearchBox, Slider } from "./partials";

export default function Homepage() {
  return (
    <div>

       <Banner />
      <SearchBox />

      <Slider />
      <PopularRoutes />
    </div>
  );
}
