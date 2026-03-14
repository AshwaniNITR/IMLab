"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Sliderprops{
    isDarkMode?: boolean;
}

const carouselImages = [
  "/labview.jpeg",
  "/firstLabPh.jpeg",
  "/secondLabPh.jpeg",
];

export default function Slider({ isDarkMode }: Sliderprops) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto rotate every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === carouselImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentImageIndex((prev) =>
      prev === carouselImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const goToSlide = (index:number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-2xl shadow-2xl">

      {/* Images */}
      {carouselImages.map((src, index) => (
        <motion.div
          key={src}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentImageIndex ? 1 : 0,
            scale: index === currentImageIndex ? 1 : 1.1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className={`absolute inset-0 ${
            index === currentImageIndex ? "block" : "hidden"
          }`}
        >
          <img
            src={src}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}

      {/* Arrows */}
      {carouselImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {carouselImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentImageIndex
                  ? "bg-orange-500 scale-110"
                  : "bg-white/70 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      {carouselImages.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {carouselImages.length}
        </div>
      )}
    </div>
  );
}