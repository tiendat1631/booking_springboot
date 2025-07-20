import { TicketInfo } from '@/services/ticket/types';
import React from 'react';

type TicketInvoiceProps = {
  data: TicketInfo;
};

const TicketInvoice: React.FC<TicketInvoiceProps> = ({ data }) => {
  return (
    <div className="w-full max-w-lg mx-auto mt-6 bg-white border rounded-lg shadow p-6 space-y-3">
      <h2 className="text-lg font-semibold text-green-700 text-center">
        HÓA ĐƠN ĐẶT VÉ
      </h2>

      <div className="grid grid-cols-2 gap-y-3 text-sm">
        <p className="font-medium">Họ tên:</p>
        <p>{data.name}</p>

        <p className="font-medium">Số điện thoại:</p>
        <p>{data.phone}</p>

        <p className="font-medium">Mã vé:</p>
        <p>{data.ticketCode}</p>

        <p className="font-medium">Tuyến:</p>
        <p>{data.trip}</p>

        <p className="font-medium">Giờ khởi hành:</p>
        <p>{data.departureTime}</p>

        <p className="font-medium">Số ghế:</p>
        <p>{data.seatNumber}</p>

        <p className="font-medium">Giá vé:</p>
        <p>{data.price.toLocaleString()} VND</p>
      </div>
    </div>
  );
};

export default TicketInvoice;
