

const routes =[
    {
        title: 'Tp HO CHI MINH',
        img: '/img/landmark81.jpg',
        trip: [
            {destination: 'Da Lat', distance: '305 km', duration:'8 gio', price: '290.000d'},
            {destination: 'Can Tho', distance: '166 km', duration: '5 gio', price: '165.000d'},
            {destination: 'Long Xuyen', distance: '203 km', duration: '5 gio' , price: '200.000d'}
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
        trip:[
            { destination: 'Đà Lạt', distance: '666km', duration: '17 giờ', price: '430.000đ' },
            { destination: 'BX An Sương', distance: '966km', duration: '20 giờ', price: '490.000đ' },
            { destination: 'Nha Trang', distance: '528km', duration: '9 giờ 25 phút', price: '370.000đ' },
        ],
    },
];

export default function PopularRoutes(){
    return (
      <section className={"py-12"}>
          <div className={"text-center mb-10"}>
              <h2 className={"text-2xl font-bold text-green-800"}>TUYẾN PHỔ BIẾN</h2>
              <p className={"mt-2"}>Được khách hàng tin tưởng và lựa chọn</p>
          </div>
          <div>
              {
                  routes.map((route, index) =>(
                      <div key={index}>
                            <div>
                                <div>
                                    Tuyen xe tu <br/>
                                    <span>{route.title}</span>
                                </div>
                            </div>
                      </div>
                  ))
              }
          </div>
      </section>
    );

}