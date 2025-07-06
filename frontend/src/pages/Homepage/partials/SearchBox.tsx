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
        <LocationSearch items={location} label='Điểm đi' placeholder='Chọn địa điểm đi' noResultText='Không tìm thấy địa điểm' />
        {/* Destination */}
        <LocationSearch items={location} label='Điểm đến' placeholder='Chọn địa điểm đến' noResultText='Không tìm thấy địa điểm' />

        <DatePicker />
        <TicketCounter max={10} value={value} setValue={setTicketCountValue} />

        {/* Starting Date */}
        {/* Number of Tickets */}
      </div>
    </Card>
  )
}
