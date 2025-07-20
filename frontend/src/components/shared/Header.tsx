import { Button } from "@/components/ui/button.tsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover.tsx";
import { LogInIcon } from "lucide-react";
import MobileSideBar from "@/components/shared/mobileSideBar";
import { Link } from "react-router";
import routeInfo from "@/routeInfo";
export default function Header() {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 min-h-[180px]">
      <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">
        <MobileSideBar />
        {/*tai ung dung*/}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              // md:inline-flex Khi viewport ≥ 768px (md) thì hiển thị lại dưới dạng inline-flex
              className={
                "text-white hover:bg-white/10 cursor-pointer hidden md:inline-flex "
              }
            >
              Tải ứng dụng
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-32 text-sm font-normal hidden md:inline-flex ">
            <div className="flex flex-col gap-2">
              <a href="" className="hover:font-medium">
                iOS
              </a>
              <a href="" className="hover:font-medium">
                Android{" "}
              </a>
            </div>
          </PopoverContent>
        </Popover>

        {/* Logo */}
        <img src={"/img/logo.png"} alt={"Futa logo"} className={"h-10"} />
        {/*login*/}
        <Link to={routeInfo.welcome}>
          <Button
            variant={"ghost"}
            className={
              "text-white hover:bg-white/10 cursor-pointer hidden md:inline-flex"
            }
          >
            <LogInIcon />
            Đăng nhập / Đăng ký
          </Button>
        </Link>
      </div>
      {/*navigation*/}
      <nav
        className={
          "hidden md:flex justify-center text-white gap-12 text-sm font-semibold uppercase mx-auto py-2 "
        }
      >
        {[
          "Trang chủ",
          "Lịch trình",
          "Tra cứu vé",
          "Hóa đơn",
          "Liên hệ",
          "Về chúng tôi",
        ].map((label) => (
          <Button
            key={label}
            variant={"link"}
            className={
              "text-white hover:font-bold p-0 cursor-pointer uppercase"
            }
          >
            {label}
          </Button>
        ))}
      </nav>
    </header>
  );
}
