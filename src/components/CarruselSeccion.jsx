import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import BookCard from './BookCard';

export default function CarruselSeccion({ titulo, libros, onEscuchar, libroActivo }) {
  return (
    <section aria-label={`Sección: ${titulo}`} className="my-12 px-6">
      <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4 uppercase tracking-wider">
        {titulo}
      </h2>

      <Swiper
        modules={[Navigation, Pagination, A11y]}
        spaceBetween={25}
        slidesPerView={1}
        navigation={{
          prevEl: `.prev-${titulo.replace(/\s/g, '')}`,
          nextEl: `.next-${titulo.replace(/\s/g, '')}`,
        }}
        pagination={{ clickable: true }}
        a11y={{
          prevSlideMessage: 'Libro anterior',
          nextSlideMessage: 'Libro siguiente',
          firstSlideMessage: 'Este es el primer libro',
          lastSlideMessage: 'Este es el último libro',
        }}
        breakpoints={{
          640:  { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {libros.map((libro) => (
          <SwiperSlide key={libro.id}>
            <BookCard
              libro={libro}
              onEscuchar={onEscuchar}
              estaActivo={libroActivo?.id === libro.id}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}