// components/HeroSection.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface HeroSectionProps {
  isDarkMode: boolean;
}

const carouselImages = [
  '/Image/Dp.jpg',
  // Add more image paths here
  '/labview.jpeg', // Example
  '/firstLabPh.jpeg', // Example
  '/secondLabPh.jpeg'
];

export default function HeroSection({ isDarkMode }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual navigation handlers
  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-white to-gray-50'
    }`}>
      {/* Carousel Container */}
      <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden">
        {/* Carousel Images */}
        {carouselImages.map((src, index) => (
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className={`absolute inset-0 ${index === currentImageIndex ? 'block' : 'hidden'}`}
          >
            <img
              src={src}
              alt={`Hero ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        {/* Navigation Arrows */}
        {carouselImages.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 z-10"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Carousel Indicators/Dots */}
        {carouselImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-orange-500 scale-110' 
                    : 'bg-white/70 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {carouselImages.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentImageIndex + 1} / {carouselImages.length}
          </div>
        )}
      </div>

      {/* Contact Section - Same as before */}
      <div className={`relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-100 to-white'
      }`}>
        {/* Decorative accent */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500`}></div>
        
        <div className="p-8 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent`}
            >
              Sougata Kumar Kar
            </motion.h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"
            ></motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className={`text-2xl md:text-3xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              Contact Us
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className={`text-lg mb-8 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Reach out for collaborations, research inquiries, or project opportunities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="mailto:kars@nitrkl.ac.in"
                className={`inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                Get in Touch
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}