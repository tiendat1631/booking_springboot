import {Button} from "@/components/ui/button.tsx";
import {LogInIcon} from "lucide-react";
import MobileSideBar from "@/components/ui/mobileSideBar.tsx";
export default function Header(){
    return (
        <header className="bg-gradient-to-r from-orange-500 to-red-500 min-h-[180px]">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">
                <MobileSideBar />
                {/*tai ung dung*/}

                <Button
                    variant={"ghost"}
                    // md:inline-flex Khi viewport ≥ 768px (md) thì hiển thị lại dưới dạng inline-flex
                    className={"text-white hover:bg-white/10 cursor-pointer hidden md:inline-flex"}>
                    Tải ứng dụng
                </Button>
                {/* Logo */}

                <img
                    src={"./public/img/logo.png"} alt={"Futa logo"} className={"h-10"}/>
                {/*login*/}

                <Button
                    variant={"ghost"}
                    className={"text-white hover:bg-white/10 cursor-pointer hidden md:inline-flex"}>
                    <LogInIcon/>
                    Dang nhap/Dang ky
                </Button>

            </div>
            {/*navigation*/}
            <nav
                className={"hidden md:flex justify-center text-white gap-12 text-sm font-semibold uppercase mx-auto py-2 "}>
                {["Trang chủ", "Lịch trình", "Tra cứu vé", "Hóa đơn", "Liên hệ", "Về chúng tôi"].map((label)=>(
                    <Button key={label} variant={"link"} className={"text-white hover:font-bold p-0 cursor-pointer uppercase"}>{label}</Button>
                ))}
            </nav>
        </header>
    );
}