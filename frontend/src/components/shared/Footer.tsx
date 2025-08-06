export default function Footer (){

    return(
        <footer className={"bg-white pt-6"}>
            <div className={"h-[300px] flex justify-center  gap-8"}>
                {/* left*/}
                <div className={""}>
                    <div className={"p-5"}>
                        <p className={"pb-1 uppercase font-semibold text-green-800"}>Trung tam tong dai & CSKH</p>
                        <p className={"pb-4 text-2xl text-orange-600 font-semibold"}>090909090</p>
                        <p className={"uppercase font-semibold text-green-800"}>Công ty cổ phần xe khách Phương Trang - FUTA Bus Lines</p>
                        <p className={"pt-2"}>Địa chỉ: <span className={"text-black font-medium"}>486-486A Lê Văn Lương, Phường Tân Hưng,TPHCM, Việt Nam.</span> </p>
                        <p className={"pt-2"}>Email: <span className={"text-orange-600"}>hotro@futa.vn</span> </p>
                        <p className={"pt-2"}>Điện thoại: <span className={"text-black font-medium"}>02838386852</span> </p>
                    </div>
                </div>
                {/* mid*/}
                <div className={""}>
                    <div>

                        <h4>FUTA Bus Lines</h4>
                        <ul>
                            <li>Tra cuu thong tin dat ve</li>
                            <li>Lich trinh</li>
                            <li>Tin tuc</li>
                            <li>Ve chung toi</li>
                            <li>Lien he</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={"bg-green-700 h-[40px] p-2"}>
                <p className={"text-white text-center"}>Member: Tien Dat, Anh Khoa, Dai Phong, Duc Minh</p>
            </div>
        </footer>
    );
}