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

    // Nhóm 3 ảnh thành 1 slide
    const groupedSlides: string[][] = [];
    for (let i = 0; i < sliders.length; i += 3) {
        groupedSlides.push(sliders.slice(i, i + 3));
    }

    return (
        // wrapper trắng ngoài cùng
        <div className="w-full bg-white py-12">
            {/* giới hạn chiều ngang bên trong */}
            <div className="w-full max-w-[1200px] mx-auto px-4">
                <h2 className="text-center text-green-800 font-bold text-2xl mb-6">
                    KHUYẾN MÃI NỔI BẬT
                </h2>

                <Swiper
                    speed={1500}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    modules={[Pagination]}
                    className="pb-12"
                >
                    {groupedSlides.map((group, index) => (
                        <SwiperSlide key={index}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {group.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt={`Khuyến mãi ${index * 3 + idx + 1}`}
                                        className="rounded-2xl shadow-xl object-cover w-[352px] h-[190px]"
                                    />
                                ))}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <style jsx global>{`
                    .swiper-pagination 
                    {
                        position: relative;
                        margin-top: 20px;
                        text-align: center;
                    }
        
                    .swiper-pagination-bullet-active {
                        width: 24px;
                        background-color: #ea580c;
                        opacity: 1;
                        border-radius: 9999px;
                    }
                `}</style>
            </div>
        </div>

    );
}
