import Header from "@/components/shared/Header";
//import TicketLookup from "../Lookup/TicketLookup";
import { Banner, PopularRoutes, SearchBox, Slider } from "./partials";
export default function Homepage() {
  return (
    <div>
      <Header />
       <Banner />
      <SearchBox />
      {/*<TicketLookup />*/}
      <Slider />
      <PopularRoutes />
    </div>
  );
}
