import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BookCard from './BookCard';

export default function CarruselSeccion({ titulo, libros }) {
  return (
    <section className="my-12 px-6">
      <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-wider">
        {titulo}
      </h2>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={25}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {libros.map((libro) => (
          <SwiperSlide key={libro.id}>
            <BookCard libro={libro} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}