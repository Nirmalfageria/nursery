'use client';
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/pagination';

const sliderImages = [
  {
    src: "/temp/banner1.jpeg",
    alt: "Indoor Plants Collection",
  },
  {
    src: "/temp/banner2.jpeg",
    alt: "Grow Your Green Space",
  },
  {
    src: "/temp/banner3.jpeg",
    alt: "Decorative Pots & Planters",
  },
   {
    src: "/temp/banner4.jpeg",
    alt: "Decorative Pots & Planters",
  }, {
    src: "/temp/banner5.jpeg",
    alt: "Decorative Pots & Planters",
  }, {
    src: "/temp/banner6.jpg",
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
          // pagination={{ clickable: true }}
          loop={true}
          className="w-full h-[40vh] sm:h-[60vh] md:h-[70vh]"
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="w-full h-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-contain w-full h-full"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
  
        {/* Intro Section */}
        <section className="text-center pt-2 px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-3">
            Welcome to Our Nursery
          </h2>
          <p className="text-gray-600  text-sm sm:text-base">
            Discover a wide range of plants, pots, and garden accessories that bring nature to your doorstep.
          </p>
        </section>
      </div>
    );
  };
  

export default Home;
