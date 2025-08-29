import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

export default function Slider() {
    const sliders = [
        '/img/slide3.jpg',
        '/img/slide4.jpg',
        '/img/slide5.jpg',
        '/img/slide6.jpg',
        '/img/slide7.jpg',
        '/img/slide8.jpg',
    ];

    return (
        <div className="w-full bg-white py-12">
            <div className="w-full max-w-[1200px] mx-auto px-4">
                <h2 className="text-center text-green-800 font-bold text-2xl mb-6">
                    KHUYẾN MÃI NỔI BẬT
                </h2>

                <Swiper
                    speed={1500}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="pb-12"
                >
                    {sliders.map((src, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={src}
                                alt={`Khuyến mãi ${index + 1}`}
                                className="rounded-2xl shadow-xl object-cover w-full h-[190px]"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>
        </div>
    );
}
