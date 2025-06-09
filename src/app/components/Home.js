'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

const sliderImages = [
  { src: "/temp/banner1.jpeg", alt: "Indoor Plants Collection" },
  { src: "/temp/banner2.jpeg", alt: "Grow Your Green Space" },
  { src: "/temp/banner3.jpeg", alt: "Decorative Pots & Planters" },
  { src: "/temp/banner4.jpeg", alt: "Decorative Pots & Planters" },
  { src: "/temp/banner5.jpeg", alt: "Decorative Pots & Planters" },
  { src: "/temp/banner6.jpg", alt: "Decorative Pots & Planters" },
];

const Home = () => {
  return (
    <main className="pt-15 h-auto overflow-x-hidden bg-white">
      {/* Hero Slider */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full h-[60vh] sm:h-[50vh] md:h-[60vh] rounded-md"
      >
        {sliderImages.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Intro Section */}
      <section className="text-center  px-4">
        <h2 className="text-xl sm:text-3xl font-bold text-green-700 mb-3">
          Welcome to Our Nursery
        </h2>
        <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
          Discover a wide range of plants, pots, and garden accessories that bring nature to your doorstep.
        </p>
      </section>
    </main>
  );
};

export default Home;
