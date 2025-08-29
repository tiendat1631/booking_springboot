import { Bus, Users, Calendar } from "lucide-react";
import { TripResponse } from "@/services/trip/types";


const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const calculateDuration = (departure: string, arrival: string) => {
  const start = new Date(departure);
  const end = new Date(arrival);
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

type TripProps = {
  trip: TripResponse;
};

const TripCard = ({ trip }: TripProps) => {
  const availableSeats = trip.tickets.length;
  const duration = calculateDuration(trip.departureTime, trip.arrivalTime);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-7xl mx-auto md:flex">
      <div className="flex-1">
        {/* Top - Date */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{formatDate(trip.departureTime)}</span>
          </div>
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-200 text-sm font-semibold">
            {duration}
          </div>
        </div>

        {/* Route info */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="text-lg font-bold text-gray-800">{trip.departureName}</div>
              <div className="text-blue-600 font-semibold">{formatTime(trip.departureTime)}</div>
            </div>

            <div className="flex-1 mx-4 relative">
              <div className="h-0.5 bg-gray-300 relative mt-3">
                <div className="absolute left-0 w-3 h-3 bg-blue-600 rounded-full -mt-1.5"></div>
                <div className="absolute right-0 w-3 h-3 bg-orange-500 rounded-full -mt-1.5"></div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-1">
                <Bus className=" w-4 h-4 text-gray-600" />
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">{trip.destinationName}</div>
              <div className="text-orange-500 font-semibold">{formatTime(trip.arrivalTime)}</div>
            </div>
          </div>

          {/* Bus info */}
          <div className="flex items-center gap-3 mt-2">
            <div className=" w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
              <Bus className="w-5 h-5 text-blue-600 " />
            </div>
            <div>
              <div className="font-semibold text-gray-800">{trip.bus.type}</div>
              <div className="text-sm text-gray-500">{trip.bus.licensePlate}</div>
            </div>
          </div>
        </div>
      </div>


      {/* Booking info */}
      <div className="p-4 bg-gray-50 flex flex-col gap-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 ">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800 ">Còn trống</span>
          </div>
          <span className="font-bold text-green-700 ml-2">{availableSeats} ghế</span>
        </div>

        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">Giá vé từ</div>
          <div className="text-2xl font-bold text-orange-500">
            {trip.ticketPrice.toLocaleString("vi-VN")}đ
          </div>
          <div className="text-xs text-gray-500">/ người</div>
        </div>

        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
          Đặt vé ngay
        </button>
      </div>
    </div>

  );
};

export default TripCard;