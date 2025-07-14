export default function FutaHighlights(){
    const highlights =[
        {
            icon: "/img/grouppeople.jpg",
            title: "Hơn 40 Triệu",
            subtitle: "Lượt khách",
            description: "Phương Trang phục vụ hơn 40 triệu lượt khách bình quân 1 năm trên toàn quốc"
        },
        {
            icon: "/img/map.jpg",
            title: "Hơn 350",
            subtitle: "Phòng vé - Bưu cục",
            description: "Phương Trang có hơn 350 phòng vé, trạm trung chuyển, bến xe,... trên toàn hệ thống"
        },
        {
            icon: "/img/bus.jpg",
            title: "Hơn 6,500",
            subtitle: "Chuyến xe",
            description: "Phương Trang phục vụ hơn 6,500 chuyến xe đường dài và liên tỉnh mỗi ngày"
        }
    ];
    return(
        <section className={"p-10 bg-white"}>
            <div className={"text-center py-4"}>
                <h2 className={" font-bold text-2xl text-green-800"}>
                    FUTA BUS LINES - CHẤT LƯỢNG LÀ DANH DỰ
                </h2>
                <p>Được khách hàng tin tưởng và lựa chọn</p>
            </div>
            {/* Content: Grid 2 columns */}
            <div className={"grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 px-26"}>
                {/*left content*/}
               <div className={"space-y-8 "}>
                   {highlights.map((item, index) =>(
                        <div key={index} className={"flex items-start gap-4"}>
                            <img src={item.icon} alt={"icon"} className={"w-16 h-16 rounded-full object-cover"}/>
                            <div>
                                <h3 className={"text-black font-bold"}>
                                    <span className={"text-3xl"}>{item.title}</span> {" "}
                                    <span className={""}>{item.subtitle}</span>
                                </h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                   ))}
               </div>
                {/*right content*/}
                <div className={"hidden md:flex justify-center items-center h-full"}>
                    <img
                        src={"/img/travelguidevietnam.jpg"}
                        alt={"travel image"}
                        className={"w-100 h-80 object-cover rounded-lg"}
                    />
                </div>
            </div>
        </section>
    );
}