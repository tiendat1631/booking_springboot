
import { useState } from 'react';
import Login from './partials/Login';
import Signup from './partials/Signup';
import { CardForm } from '@/components/ui/card';
import {Link} from "react-router";
import routeInfo from "@/routeInfo.ts";

export default function Welcome() {
  const [isLogin, setIsLogin] = useState(true);

  return (
      <>
        <header className={"bg-gradient-to-r from-orange-500 to-red-500 min-h-[180px] flex justify-center"}>
            <Link to={routeInfo.homepage}>
                <img src={"../img/logo.png"} alt={"logo"} className={"h-15 w-20"}/>
            </Link>

        </header>
          <div
              className='py-12 flex flex-col gap-4 items-center justify-center md:flex-row md:justify-center md:items-start -mt-[120px]'>
          {/* left content */}


          {/* Form Login & Sign up */}
          <div className={"flex border rounded-xl shadow-lg overflow-hidden bg-white"}>
            <div>
              <img src={"../img/form.jpg"} alt={"img"} className={"hidden md:inline-flex"}/>
            </div>
          <CardForm className='w-full sm:w-md'>
            {isLogin ? (
              <Login switcher={() => setIsLogin(false)}/>
              ) : (
             <Signup switcher={() => setIsLogin(true)}/>
            )}
           </CardForm>
          </div>
        </div>
      </>
  );
}
