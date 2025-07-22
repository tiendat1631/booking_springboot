import React, { useState } from 'react';
import { signup } from '../services';

type SignupProps = {
  switcher: () => void;
};

export default function Signup({ switcher }: SignupProps) {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');

  const [isSubmit, setSubmit] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);
    setMessage(null);

    try {
      const result = await signup({ username, password, email, name, age });
      console.log(result)
      if (result.success) {
        setMessage(result.message || "Đăng ký thành công!");
      } else {
        setMessage(result.message || "Đăng ký thất bại.");
      }
    } catch (error: any) {
      setMessage(error.message || "Đã xảy ra lỗi không xác định.");
    } finally {
      setSubmit(false);
    }

  };

  const handleSwitch = () => {
    if (isSubmit) return;
    switcher();
  };

  return (
    <>
      <div>
        <h1 className='text-3xl font-semibold'>Đăng ký</h1>
        <p className='mt-2'>
          Đã có tài khoản?{' '}
          <button onClick={handleSwitch} className='link'>
            Đăng nhập
          </button>
        </p>
      </div>
      <form
          onSubmit={handleSubmit}
          className='mt-6 max-w-[400px] flex flex-col gap-2'>
        <input
            onChange={(e) => setName(e.target.value)}
            type='text'
            name='name'
            placeholder='nhap ten'
            className='input w-full'
        />
        <input
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            name='username'
            placeholder='Nhập tên dang nhap'
            className='input w-full'
        />
        <input
            onChange={(e) => setAge(e.target.value)}
            type='text'
            name='age'
            placeholder='Nhập tuoi'
            className='input w-full'
        />
        <input
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            name='email'
            placeholder='Nhập email'
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
      {message && (
          <div className="text-center text-sm text-red-500 mt-2">
            {message}
          </div>
      )}
    </>
  );
}
