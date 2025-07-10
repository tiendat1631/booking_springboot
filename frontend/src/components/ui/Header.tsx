import {Button} from "@/components/ui/button.tsx";
import {LogInIcon} from "lucide-react";

export default function Header(){
    return (
        <header className="bg-gradient-to-r from-orange-500 to-red-500 min-h-[180px]">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">

                <div className={"flex items-center gap-2 "}>
                    <Button variant={"ghost"} className={"text-white hover:bg-white/10 cursor-pointer"}>
                        Tải ứng dụng
                    </Button>
                </div>
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src={"./public/img/logo.png"}
                         alt={"Futa logo"}
                         className={"h-10"}
                    />
                </div>
                {/*login*/}
                <div className={"flex items-center gap-2 "}>
                    <Button variant={"ghost"} className={"text-white hover:bg-white/10 cursor-pointer"}>
                        <LogInIcon/>
                        Dang nhap/Dang ky
                    </Button>
                </div>


            </div>
            <nav className={"hidden md:flex justify-center text-white gap-12 text-sm font-semibold uppercase mx-auto py-2 "}>
                <a href="" className={"cursor-pointer hover:font-bold"}>Trang chu</a>
                <a href="" className={"cursor-pointer hover:font-bold"}>Lich trinh</a>
                <a href="" className={"cursor-pointer hover:font-bold"}>Tra cuu ve</a>
                <a href="" className={"cursor-pointer hover:font-bold"}>Hoa don</a>
                <a href="" className={"cursor-pointer hover:font-bold"}>Lien he</a>
                <a href="" className={"cursor-pointer hover:font-bold"}>Ve chung toi</a>
            </nav>
        </header>
    );
}