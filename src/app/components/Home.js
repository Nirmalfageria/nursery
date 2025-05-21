'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

const sliderImages = [
  {
    src: "/temp/banner1.jpg",
    alt: "Indoor Plants Collection",
  },
  {
    src: "/temp/banner4.jpg",
    alt: "Grow Your Green Space",
  },
  {
    src: "/temp/banner3.jpg",
    alt: "Decorative Pots & Planters",
  },
];


  const Home = () => {
    return (
      <div className="pt-[60px] py-15"> {/* added pt-[70px] */}
        {/* Hero Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh]"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-fill w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
  
        {/* Intro Section */}
        <section className="text-center py-10 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-3">
            Welcome to Our Nursery
          </h2>
          <p className="text-gray-600 mx-auto text-sm sm:text-base max-w-3xl">
            Discover a wide range of plants, pots, and garden accessories that bring nature to your doorstep.
          </p>
        </section>
      </div>
    );
  };
  

export default Home;
