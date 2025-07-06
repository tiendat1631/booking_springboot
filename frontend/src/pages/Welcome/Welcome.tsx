import {
  BusFrontIcon,
  Check,
  ClockIcon,
  GiftIcon,
  MapPinIcon,
  TicketsIcon,
} from 'lucide-react';
import { useState } from 'react';
import Login from './partials/Login';
import Signup from './partials/Signup';
import { Card } from '@/components/ui/card';

export default function Welcome() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='py-12 flex flex-col gap-4 md:flex-row md:justify-center md:items-start'>
      {/* Header */}
      <div className='flex flex-col justify-center md:pl-8'>
        <div className='text-center'>
          <p className='text-4xl font-bold font-merriweather'>
            VéXe24
          </p>
          <p className='mt-2 text-xl font-semibold'>
            Cho hành trình êm ru
          </p>
        </div>
        <div className='flex gap-4 justify-center mt-4.5 mb-4 md:mb-6 text-2xl'>
          <BusFrontIcon size={32} className='text-purple-500' />
          <MapPinIcon size={32} className='text-red-400' />
          <ClockIcon size={32} className='text-yellow-400' />
          <TicketsIcon size={32} className='text-pink-400' />
          <GiftIcon size={32} className='text-green-400' />
        </div>
        <div className='hidden md:block w-4/5 mx-auto'>
          <ul>
            {[
              "Tuyến xe đa dạng",
              "Điểm đón tiện lợi",
              "Thời gian linh hoạt",
              "Giá vé hợp lý",
              "Ưu đãi hấp dẫn"
            ].map((item, index) => (
              <li key={index} className='flex items-center gap-2 mb-2'>
                <Check className="text-green-700" size={18} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form Login & Sign up */}
      <div className='px-2.5 sm:px-8 grid place-items-center'>
        <Card className='w-full sm:w-md'>
          {isLogin ? (
            <Login switcher={() => setIsLogin(false)} />
          ) : (
            <Signup switcher={() => setIsLogin(true)} />
          )}
        </Card>
      </div>
    </div>
  );
}
