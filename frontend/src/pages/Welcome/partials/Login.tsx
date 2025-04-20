import React, { useState } from 'react';
import { login } from '../services';

type LoginProps = {
  switcher: () => void;
};

export default function Login({ switcher }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isSubmit, setSubmit] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);
    const result = await login({ username, password });
  };

  const handleSwitch = () => {
    if (isSubmit) return;
    
    switcher();
  };

  return (
    <>
      <div>
        <h1 className='text-3xl font-semibold'>Đăng nhập</h1>
        <p className='mt-2'>
          Chưa có tài khoản?{' '}
          <button onClick={handleSwitch} className='link'>
            Đăng ký ngay
          </button>
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className='mt-6 max-w-[400px] flex flex-col gap-2'>
        <input
          onChange={(e) => setUsername(e.target.value)}
          type='text'
          name='username'
          placeholder='Nhập tên người dùng'
          className='input w-full'
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type='password'
          name='password'
          placeholder='Nhập mật khẩu'
          className='input w-full'
        />
        <button className='btn btn-primary btn-block mt-4'>
          {isSubmit && <span className='loading loading-spinner'></span>}
          Đăng nhập
        </button>
      </form>
      <p className='mt-6 text-sm text-center'>
        <a href='#' className='link'>
          Quên mật khẩu
        </a>
      </p>
    </>
  );
}
