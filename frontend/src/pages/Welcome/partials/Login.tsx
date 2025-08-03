import React, { useState } from 'react';

import axios from "axios";
import {login} from "@/pages/Welcome/services.ts";
import { useNavigate } from "react-router-dom";
import routeInfo from "@/routeInfo";

type LoginProps = {
  switcher: () => void;
};

export default function Login({ switcher }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  const [isSubmit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);
    try {
      const {token, refreshToken} = await login({ username, password });

      // Lưu vào localStorage hoặc context
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      //setMessage("Đăng nhập thành công!");
      // Điều hướng hoặc cập nhật state
      navigate(routeInfo.homepage);

    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message || "Đăng nhập thất bại.");
      } else {
        setMessage("Lỗi không xác định.");
      }
    } finally {
      setSubmit(false);
    }
  };
  const handleSwitch = () => {
    if (isSubmit) return;
    switcher();
  };

  return (

        <div className={"p-6"}>
          <div className={"text-center py-6"}>
            <h1 className='text-3xl font-semibold py-4'>Đăng nhập tài khoản </h1>
            <div>
              <button
                  className="px-4 py-2 font-semibold  text-orange-500 border-b-2
                  border-orange-500 cursor-pointer ">
                Đăng nhập
              </button>
              <button
                    className={"px-4 py-2 font-semibold text-orange-500  cursor-pointer"}
                  onClick={handleSwitch}
              >
                Đăng ký
              </button>
            </div>

          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            {/*username*/}
            <input
                onChange={(e) => setUsername(e.target.value)}
                type='text'
                name='username'
                placeholder='Nhập tên người dùng'
                className='input w-full border-2 h-[30px] p-6 rounded-xl'
            />
            <input
                onChange={(e) => setPassword(e.target.value)}
                type='password'
                name='password'
                placeholder='Nhập mật khẩu'
                className='input w-full border-2 h-[30px] p-6 rounded-xl'
            />
            <button className='bg-orange-500 btn btn-primary btn-block mt-4 h-[44px] rounded-full cursor-pointer'>
              {isSubmit && <span className='loading loading-spinner'></span>}
              Đăng nhập
            </button>
          </form>
          <p className='mt-6 text-sm '>
            <a href='#' className='link'>
              Quên mật khẩu
            </a>
          </p>
          {message && (
              <div className="text-green-600 font-semibold">
                {message}
              </div>
          )}
        </div>


  );
}
