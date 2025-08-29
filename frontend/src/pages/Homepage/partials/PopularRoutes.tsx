const routes = [
    {
        title: 'Tp HO CHI MINH',
        img: '/img/landmark81.jpg',
        trip: [
            { destination: 'Da Lat', distance: '305 km', duration: '8 gio', price: '290.000d' },
            { destination: 'Can Tho', distance: '166 km', duration: '5 gio', price: '165.000d' },
            { destination: 'Long Xuyen', distance: '203 km', duration: '5 gio', price: '200.000d' }
        ],
    },
    {
        title: 'DA LAT',
        img: '/img/dalat.jpg',
        trip: [
            { destination: 'TP. Hồ Chí Minh', distance: '310km', duration: '8 giờ', price: '290.000đ' },
            { destination: 'Đà Nẵng', distance: '757km', duration: '17 giờ', price: '430.000đ' },
            { destination: 'Cần Thơ', distance: '457km', duration: '16 giờ', price: '445.000đ' },
        ],
    },
    {
        title: 'DA NANG',
        img: '/img/danang.jpg',
        trip: [
            { destination: 'Đà Lạt', distance: '666km', duration: '17 giờ', price: '430.000đ' },
            { destination: 'BX An Sương', distance: '966km', duration: '20 giờ', price: '490.000đ' },
            { destination: 'Nha Trang', distance: '528km', duration: '9 giờ 25 phút', price: '370.000đ' },
        ],
    },
];

export default function PopularRoutes() {
    //const today = new Date.toLocaleDateString('en-GB')
    return (
        <section className={"py-12 px-20"}>
            <div className={"text-center mb-10"}>
                <h2 className={"text-2xl font-bold text-green-800 "}>TUYẾN PHỔ BIẾN</h2>
                <p className={"mt-2"}>Được khách hàng tin tưởng và lựa chọn</p>
            </div>
            <div className={"grid grid-cols-3 justify-center gap-x-5"}>
                {routes.map((route, index) => (
                    <div key={index} className={"bg-white rounded-lg shadow-md "}>
                        <div className={"relative h-30"}>
                            <img
                                src={route.img}
                                className={"w-full h-full object-cover rounded-lg"}
                            />
                            <div className={"absolute inset-0  bg-opacity-50 text-white p-4 flex flex-col justify-end"}>
                                <span className="text-xl font-semibold"> Tuyến xe từ <br />{route.title}</span>
                            </div>

                        </div>

                        <div className={"p-4"}>
                            {route.trip.map((trip, idx) => (
                                <div key={idx} className={"py-2"}>
                                    <div className={"flex justify-between"}>
                                        <span className={"font-bold text-green-800"}>{trip.destination}</span>
                                        <span>{trip.price}</span>
                                    </div>
                                    <div>{trip.distance} - {trip.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

}