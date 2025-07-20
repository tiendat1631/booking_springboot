import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { location } from "@/mocks/location";
import { searchTicket } from "@/services/ticket/ticketServices";
import { isBefore, startOfToday } from "date-fns";
import { LucideMessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import DatePicker from "./DatePicker";
import { LocationSearch } from "./LocationComboBox";
import TicketCounter from "./TicketCounter";

export default function SearchBox() {
  const [ticket, setTicket] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSearch = async () => {
    const data = await searchTicket({ from, to, date, ticket });
    if (data.success) {
      // TODO: hien thi ket qua
      console.log("Kết quả chuyến đi:", data);
    } else {
      console.error("Lỗi:", data.error);
    }
  };

  const setTicketCountValue = (str: string) => {
    const number = Number(str);
    setTicket(number);
  };

  return (
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
          value={from}
          items={location}
          setValue={(val) => setFrom(val)}
          label="Điểm đi"
          placeholder="Chọn địa điểm đi"
          noResultText="Không tìm thấy địa điểm"
        />
        {/* Destination */}
        <LocationSearch
          value={to}
          items={location}
          setValue={(val) => {
            setTo(val);
          }}
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
  );
}
