import {
  BusFrontIcon,
  ClockIcon,
  GiftIcon,
  MapPinIcon,
  TicketsIcon,
} from 'lucide-react';
import { useState } from 'react';
import Login from './partials/Login';
import Signup from './partials/Signup';

export default function Welcome() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='grow bg-base-200 pt-12'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col justify-center px-8'>
          <div className='text-center'>
            <p className='text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
              VéXe24
            </p>
            <p className='mt-3 text-xl font-semibold italic'>
              Vé nhanh - Ghế đẹp - Hành trình trọn vẹn
            </p>
          </div>
          <div className='flex gap-4 justify-center mt-6 mb-8 text-2xl'>
            <BusFrontIcon size={32} className='text-primary' />
            <MapPinIcon size={32} className='text-error' />
            <ClockIcon size={32} className='text-warning' />
            <TicketsIcon size={32} className='text-info' />
            <GiftIcon size={32} className='text-success' />
          </div>
        </div>
        <div className='grid place-items-center'>
          <div className='min-w-[500px] card bg-base-100 px-12 py-8 border border-base-300'>
            {isLogin ? (
              <Login switcher={() => setIsLogin(false)} />
            ) : (
              <Signup switcher={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
