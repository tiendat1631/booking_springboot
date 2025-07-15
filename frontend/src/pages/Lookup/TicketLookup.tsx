import React, { useState } from 'react'
import TicketInvoice, { TicketInfo } from './partials/TicketInvoice'

const TicketLookup = () => {
  const [phoneNum, setPhoneNum] = useState('')
  const [ticketCode, setTicketCode] = useState('')

  const [result, setResult] = useState<TicketInfo | null>(null)

  const fakeData = {
    name: 'Nguyễn Văn A',
    phone: '0912345678',
    ticketCode: 'ACDS1234',
    trip: 'Hà Nội → Sài Gòn',
    departureTime: '20/07/2025 - 07:00',
    seatNumber: 'B12',
    price: 450000,
  };

  const handleLookup = () => {
    setResult(fakeData)
  }

  return (
    <div className='flex flex-col ju items-center py-8'>
      <h1 className='text-green-800 mb-6 text-xl font-medium'>TRA CỨU THÔNG TIN ĐẶT VÉ</h1>

      <div className='flex flex-col items-center space-y-4 w-full max-w-md mx-auto'>
        <input
          type="text"
          placeholder="Vui lòng nhập số điện thoại"
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Vui lòng nhập mã vé"
          className="w-full rounded px-4 py-2"
        />
        <button
          onClick={handleLookup}
          className="w-56 bg-red-100 text-red-500 px-4 py-2 rounded-2xl hover:bg-orange-500 hover:text-white transition-colors duration-200"
        > Tra cứu</button>
      </div>

    {result && <TicketInvoice data={result}/>}

    </div>
  )
}

export default TicketLookup