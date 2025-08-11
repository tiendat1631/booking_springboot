import React from "react";
import {Button} from "@/components/ui/button";
import {MenuIcon} from "lucide-react";
import {Dialog} from "@/components/ui/dialog";


export default function MobileSideBar(){
    const [open, setOpen] = React.useState(false);

    const navItems = [
        "Đăng nhập/Đăng ký",
        "Trang chủ",
        "Lịch trình",
        "Tra cứu vé",
        "Tin tức",
        "Liên hệ",
        "Về chúng tôi",
    ]
    return(
        <div className={"md:hidden"}>
            {/*nut menu ben trai*/}
            <Button
                variant={"ghost"}
                className={"cursor-pointer"}
                size={"icon"}
                onClick={()=>setOpen(true)}>
                <MenuIcon className={"w-6 h-6 text-white"}/>
            </Button>
            {/*sidebar*/}
            <Dialog open={open} onOpenChange={setOpen}>
                {open && (
                    <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
                        {/* lớp nền mờ, đóng khi click ngoài */}
                    </div>
                )}

                {open && (
                    <div
                        className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-xs bg-white shadow-lg flex flex-col"
                    >

                        <nav className="flex flex-col text-sm px-4 text-[12px]">
                            {navItems.map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={`py-3 border-b text-left ${
                                        index === 0 ? "text-orange-600 font-semibold " : ""
                                    }`}
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </Dialog>

        </div>
    );
}