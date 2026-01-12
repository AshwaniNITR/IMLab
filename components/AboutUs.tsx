// components/AboutUs.tsx
'use client';

import { motion } from 'framer-motion';

interface AboutUsProps {
  isDarkMode: boolean;
}

export default function AboutUs({ isDarkMode }: AboutUsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
      }`}
    >
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${
        isDarkMode ? 'from-orange-500 to-orange-600' : 'from-orange-500 to-orange-600'
      }`}></div>
      
      <div className="pl-8 pr-6 py-8">
        {/* Header with gradient text */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About Our Lab
          </h2>
          <div className="w-12 h-1 mt-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </div>

        {/* Content */}
        <div className={`space-y-6 text-lg leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            The <span className={`font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              Integrated System Design Lab
            </span> focuses on cutting-edge research in hardware design, artificial intelligence acceleration, and advanced computing systems.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our team works on developing innovative solutions for next-generation computing architectures, with particular emphasis on <span className={`font-semibold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              energy-efficient AI hardware
            </span>, approximate computing, and semiconductor design.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            We collaborate with leading industry partners and academic institutions to push the boundaries of what's possible in integrated systems and microelectronics.
          </motion.p>
        </div>

        {/* Accent line */}
      
      </div>
    </motion.div>
  );
}