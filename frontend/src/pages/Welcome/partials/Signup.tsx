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
    <div className={"p-6"}>
      <div className={"text-center py-6"}>
        <h1 className='text-3xl font-semibold py-4'>Tạo tài khoản</h1>
          <button
              className={"px-4 py-2 font-semibold text-orange-600 border-orange-500 cursor-pointer"}
              onClick={handleSwitch}
          >
            Đăng nhập
          </button>
          <button  className='px-4 py-2 font-semibold text-orange-600 border-b-2 border-orange-500 cursor-pointer'>
            Đăng ký
          </button>

      </div>
      <form
          onSubmit={handleSubmit}
          className=' max-w-[400px] flex flex-col gap-4'>
        <input
            onChange={(e) => setName(e.target.value)}
            type='text'
            name='name'
            placeholder='nhap ten'
            className='input w-full border-2 h-[30px] p-4 rounded-xl'
        />
        <input
            onChange={(e) => setUsername(e.target.value)}
            type='text'
            name='username'
            placeholder='Nhập tên dang nhap'
            className='input w-full border-2 h-[30px] p-4 rounded-xl'
        />
        <input
            onChange={(e) => setAge(e.target.value)}
            type='text'
            name='age'
            placeholder='Nhập tuoi'
            className='input w-full border-2 h-[30px] p-4 rounded-xl'
        />
        <input
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            name='email'
            placeholder='Nhập email'
            className='input w-full border-2 h-[30px] p-4 rounded-xl'
        />
        <input
            onChange={(e) => setPassword(e.target.value)}
            type='password'
            name='password'
            placeholder='Nhập mật khẩu'
            className='input w-full border-2 h-[30px] p-4 rounded-xl'
        />
        <button className=' bg-orange-500 btn btn-primary btn-block mt-4 h-[44px] rounded-full cursor-pointer'>
          {isSubmit && <span className='loading loading-spinner'></span>}
          Đăng nhập
        </button>
      </form>

      {message && (
          <div className="text-center text-sm text-red-500 mt-2">
            {message}
          </div>
      )}
    </div>


  );
}
