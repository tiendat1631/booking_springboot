import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white pt-10 border-t">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left - Contact */}
                <div>
                    <h3 className="uppercase font-bold text-green-800 mb-2">
                        Trung tâm tổng đài & CSKH
                    </h3>
                    <p className="text-3xl font-bold text-orange-600 mb-4">0909 090 090</p>
                    <h4 className="uppercase font-semibold text-green-800">
                        Công ty cổ phần xe khách Phương Trang - FUTA Bus Lines
                    </h4>
                    <div className="mt-4 space-y-2 text-gray-700">
                        <p className="flex items-start gap-2">
                            <MapPin className="w-5 h-5 text-green-700 mt-1" />
                            <span>
                                486-486A Lê Văn Lương, Phường Tân Hưng, TPHCM, Việt Nam
                            </span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-700" />
                            <span className="text-orange-600">hotro@futa.vn</span>
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-green-700" />
                            <span className="font-medium">0283 838 6852</span>
                        </p>
                    </div>
                </div>

                {/* Middle - Links */}
                <div>
                    <h4 className="uppercase font-bold text-green-800 mb-3">FUTA Bus Lines</h4>
                    <ul className="space-y-2 text-gray-700">
                        <li className="hover:text-orange-600 cursor-pointer">Tra cứu thông tin đặt vé</li>
                        <li className="hover:text-orange-600 cursor-pointer">Lịch trình</li>
                        <li className="hover:text-orange-600 cursor-pointer">Tin tức</li>
                        <li className="hover:text-orange-600 cursor-pointer">Về chúng tôi</li>
                        <li className="hover:text-orange-600 cursor-pointer">Liên hệ</li>
                    </ul>
                </div>

                {/* Right - Extra Info / Branding */}
                <div>
                    <h4 className="uppercase font-bold text-green-800 mb-3">Về FUTA</h4>
                    <p className="text-gray-700">
                        FUTA Bus Lines là đơn vị vận tải uy tín hàng đầu Việt Nam,
                        cam kết mang đến cho khách hàng trải nghiệm an toàn, thoải mái và nhanh chóng.
                    </p>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-green-700 mt-8">
                <p className="text-white text-center py-3 text-sm">
                    © 2025 FUTA Bus Lines. All rights reserved. | Member: Tien Dat, Anh Khoa, Dai Phong, Duc Minh
                </p>
            </div>
        </footer>
    );
}
