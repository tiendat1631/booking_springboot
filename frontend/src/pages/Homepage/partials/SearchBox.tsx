import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import { location } from '@/mocks/location'
import { LucideMessageCircleQuestion } from 'lucide-react'
import { useState } from 'react'
import DatePicker from './DatePicker'
import { LocationSearch } from './LocationComboBox'
import TicketCounter from './TicketCounter'

export default function SearchBox() {
  const [value, setValue] = useState(1);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const handleSearch = async () => {
/*    console.log("========== Tìm kiếm ==========");
    console.log("Điểm đến (to):", to);
    console.log("Điểm đi (from):", from);
    console.log("Ngày đi:", date);
    console.log("========== Kết thúc ==========");*/
    try {
      const params = new URLSearchParams({
        from: from,
        to: to,
        date: date,
        numberOfTickets: value.toString(),
      });

      const response = await fetch(`http://localhost:8080/trip?${params.toString()}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tìm chuyến xe");
      }

      const result = await response.json();
      console.log("Kết quả chuyến đi:", result);
      // TODO: hiển thị kết quả ở đây

    } catch (error) {
      console.error("Lỗi:", error);
    }
  }

  const setTicketCountValue = (str: string) => {
    const number = Number(str);
    setValue(number);
  }

  return (
    <Card className='max-w-[1500px]'>
      <CardHeader>
        <CardTitle>Tìm kiếm chuyến đi</CardTitle>
        <CardAction>
          <Button variant='link' className='py-0 pr-0'><LucideMessageCircleQuestion />
            Hướng dẫn
          </Button>
        </CardAction>
      </CardHeader>

      <div className=' flex flex-col px-4 gap-5 md:px-16 md:flex-row sm:items-center md:justify-between md:flex-wrap'>
        {/* Starting location */}
        <LocationSearch items={location}   onValueChange={(val) => {
          setFrom(val);
          console.log("Chọn điểm đến:", val);
        }}  label='Điểm đi' placeholder='Chọn địa điểm đi' noResultText='Không tìm thấy địa điểm' />
        {/* Destination */}
        <LocationSearch items={location}   onValueChange={(val) => {
          setTo(val);
          console.log("Chọn điểm đến:", val);
        }}  label='Điểm đến' placeholder='Chọn địa điểm đến' noResultText='Không tìm thấy địa điểm' />

        <DatePicker onChange={setDate} />
        <TicketCounter max={10} value={value} setValue={setTicketCountValue} />

        {/* Starting Date */}
        {/* Number of Tickets */}{/* Nút Tìm chuyến xe */}
        <div className='flex justify-center py-6 w-full'>
          <Button
              onClick={handleSearch}
              className='cursor-pointer bg-[#FF5722] hover:bg-[#e64a19] text-white px-8 py-4 text-lg rounded-full'>
            Tìm chuyến xe
          </Button>
        </div>

      </div>
    </Card>
  )
}
