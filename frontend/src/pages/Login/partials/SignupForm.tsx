import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { signup } from "@/services/auth/authServices";

type SignupProps = {
  switcher: () => void;
};

export default function SignupForm({ switcher }: SignupProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setSubmit] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);

    try {
      const res = await signup({ username, password, name, email, age: Number(age) });

      if (res.success) {
        toast.success(res.message)
        switcher();
      } else {
        toast.error(res.message)
      }

    } catch (err) {
      toast.error("Có lỗi xảy ra khi đăng ký.");
    } finally {
      setSubmit(false);
    };
  }

  const handleSwitch = () => {
    if (isSubmit) return;
    switcher();
  };

  return (
    <div className="p-6">
      <div className="text-center py-6">
        <h1 className="text-3xl font-semibold py-4">Tạo tài khoản</h1>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-4 py-2 font-semibold text-gray-600 hover:text-orange-600 cursor-pointer"
            onClick={handleSwitch}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="px-4 py-2 font-semibold text-orange-600 border-b-2 border-orange-500 cursor-default"
          >
            Đăng ký
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-[400px] mx-auto flex flex-col gap-4"
      >
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          name="name"
          value={name}
          placeholder="Nhập tên"
          required
          className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          value={username}
          placeholder="Nhập tên đăng nhập"
          required
          className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          onChange={(e) => setAge(e.target.value)}
          type="number"
          name="age"
          value={age}
          placeholder="Nhập tuổi"
          required
          min={1}
          className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        // ^ ẩn mũi tên Chrome/Safari
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          value={email}
          placeholder="Nhập email"
          required
          className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Password with show/hide */}
        <div className="relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            placeholder="Nhập mật khẩu"
            required
            minLength={6}
            className="input input-bordered w-full h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold mt-4 h-[44px] rounded-full cursor-pointer flex items-center justify-center"
        >
          {isSubmit ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Đăng ký"
          )}
        </button>
      </form>
    </div>
  );
}

