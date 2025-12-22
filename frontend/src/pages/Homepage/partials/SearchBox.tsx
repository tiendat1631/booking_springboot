import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { isBefore, startOfToday } from "date-fns";
import { LucideMessageCircleQuestion } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "./DatePicker";
import { LocationSearch } from "./LocationComboBox";
import TicketCounter from "./TicketCounter";
import { ProvinceResponse } from "@/services/province/types";
import { getProvince } from "@/services/province/provinceSerivce";
import { SearchTrips } from "@/services/trip/tripService";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { TripResponse } from "@/services/trip/types";
import { TripList } from "@/components/trip/TripFilter";

export default function SearchBox() {
  const [ticket, setTicket] = useState(1);
  const [departureCode, setDepartureCode] = useState<number>(1);
  const [destinationCode, setDestinationCode] = useState<number>(79);
  const [date, setDate] = useState<Date>(new Date());

  const [location, setLocation] = useState<ProvinceResponse[]>([]);
  const [trips, setTrips] = useState<TripResponse[]>([]);

  useEffect(() => {
    const fetchLocation = async () => {
      const provinces = await getProvince();
      setLocation(provinces.map(({ name, code, codename }) => ({ name, code, codename })));
    };

    fetchLocation();
  }, []);

  const handleSearch = async () => {
    console.log(departureCode)
    console.log(destinationCode)
    console.log(dayjs(date).format("YYYY-MM-DD"))
    console.log(ticket)

    const res = await SearchTrips({ departureCode, destinationCode, departureTime: dayjs(date).format("YYYY-MM-DD"), ticketNum: ticket })
    if (res.success) {
      console.log(res.data)
      setTrips(res.data);
      toast.success(res.message)
    } else {
      setTrips([]);
      toast.error(res.message);
    }
  };

  const setTicketCountValue = (str: string) => {
    const number = Number(str);
    setTicket(number);
  };

  return (
    <div className="space-y-10">
      <Card className="max-w-[1500px]">
        <CardHeader>
          <CardTitle>Tìm kiếm chuyến đi</CardTitle>
          <CardAction>
            <Button variant="link" className="py-0 pr-0">
              <LucideMessageCircleQuestion />
              Hướng dẫn
            </Button>
          </CardAction>
        </CardHeader>

        <div className=" flex flex-col px-4 gap-5 md:px-16 md:flex-row sm:items-center md:justify-between md:flex-wrap">
          {/* Starting location */}
          <LocationSearch
            value={departureCode}
            items={location}
            setValue={setDepartureCode}
            label="Điểm đi"
            placeholder="Chọn địa điểm đi"
            noResultText="Không tìm thấy địa điểm"
          />
          {/* Destination */}
          <LocationSearch
            value={destinationCode}
            items={location}
            setValue={setDestinationCode}
            label="Điểm đến"
            placeholder="Chọn địa điểm đến"
            noResultText="Không tìm thấy địa điểm"
          />

          <DatePicker
            label="Ngày đi"
            value={date}
            setValue={(newDate) => setDate(newDate)}
            disabledOn={(date) => isBefore(date, startOfToday())}
          />
          <TicketCounter max={10} value={ticket} setValue={setTicketCountValue} />

          {/* Nút Tìm chuyến xe */}
          <div className="flex justify-center py-6 w-full">
            <Button
              onClick={handleSearch}
              className="cursor-pointer bg-[#FF5722] hover:bg-[#e64a19] text-white px-8 py-4 text-lg rounded-full"
            >
              Tìm chuyến xe
            </Button>
          </div>
        </div>
      </Card>

      {trips.length > 0 && <TripList trips={trips} />}
    </div>
  );
}
