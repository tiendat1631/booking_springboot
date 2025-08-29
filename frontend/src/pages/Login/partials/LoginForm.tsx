import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import routeInfo from "@/routeInfo";
import { toast } from "react-toastify";
import { login } from "@/services/auth/authServices";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

type LoginProps = {
  switcher: () => void;
};

export default function LoginForm({ switcher }: LoginProps) {
  const { handleLogin: loginContext } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setSubmit] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmit) return;

    setSubmit(true);
    try {

      const res = await login({ username, password });

      if (res.success) {
        const { accessToken, user } = res.data;
        loginContext(user, accessToken);

        toast.success("Đăng nhập thành công!");
        navigate(routeInfo.homepage);
      } else {
        toast.error(res.message || "Đăng nhập thất bại.");
      }

    } catch (err) {
      toast.error("Có lỗi xảy ra khi đăng nhập.");
    } finally {
      setSubmit(false);
    }
  };

  const handleSwitch = () => {
    if (isSubmit) return;
    switcher();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center py-6">
        <h1 className="text-3xl font-semibold py-4">Đăng nhập tài khoản</h1>
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-4 py-2 font-semibold text-orange-500 border-b-2 border-orange-500 cursor-default"
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className="px-4 py-2 font-semibold text-orange-500 hover:text-orange-600"
            onClick={handleSwitch}
          >
            Đăng ký
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Username */}
        <input
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          name="username"
          value={username}
          placeholder="Nhập tên người dùng"
          required
          className="input input-bordered w-full h-12 rounded-xl border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"

        />

        {/* Password + show/hide */}
        <div className="relative">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            placeholder="Nhập mật khẩu"
            required
            className="input input-bordered w-full h-12 rounded-xl border-gray-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-orange-500 text-white font-semibold mt-4 h-[44px] rounded-full cursor-pointer flex items-center justify-center hover:bg-orange-600 transition"
        >
          {isSubmit ? (
            <span className="loading loading-spinner loading-lg text-primary"></span>
          ) : (
            "Đăng nhập"
          )}
        </button>
      </form>

      {/* Forgot password */}
      <p className="mt-6 text-sm text-center">
        <a href="#" className="text-orange-500 hover:underline">
          Quên mật khẩu?
        </a>
      </p>
    </div>
  );
}
