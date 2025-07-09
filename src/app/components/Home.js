'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import PlantsPage from '../plants/page';  // Import plants page component
import PotsPage from '../pots/page';      // Import pots page component


const sliderImages = [
  { src: '/temp/banner1.jpeg', alt: 'Indoor Plants Collection' },
  

  { src: '/temp/banner2.jpeg', alt: 'Grow Your Green Space' },

 
  { src: '/temp/banner4.jpeg', alt: 'Decorative Pots & Planters' },
  { src: '/temp/banner5.jpeg', alt: 'Decorative Pots & Planters' },
  { src: '/temp/banner6.jpeg', alt: 'Decorative Pots & Planters' },
];

export default function Home() {
  return (
    <main className="pt-[60px] bg-white overflow-x-hidden scroll-smooth">
      {/* Hero Slider */}
      <section id="home" className="w-full h-[30vh] sm:h-[50vh] md:h-[60vh] rounded-md overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          loop={true}
          // pagination={{ clickable: true }}
          className="w-full h-full"
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
      </section>

      {/* Intro */}
      <section className="text-center px-4 pt-8 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">
          Welcome to Our Bageechi
        </h2>
        <p className="text-gray-600">
          Discover a wide range of plants, pots, and garden accessories that bring nature to your doorstep.
        </p>
      </section>

      {/* Render other pages inline */}
      <section id="plants" className="min-h-screen">
        <PlantsPage />
      </section>

      
{/* 
      <section id="pots" className="">
        <PotsPage />
      </section> */}

      
    </main>
  );
}
