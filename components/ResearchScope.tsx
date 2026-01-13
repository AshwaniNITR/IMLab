// components/ResearchScope.tsx
'use client';

import { motion } from 'framer-motion';

interface ScopeItem {
  id: number;
  title: string;
  description: string;
  img: string;
}

interface ResearchScopeProps {
  isDarkMode: boolean;
}

const scopeData: ScopeItem[] = [
  {
    id: 1,
    title: "Analog IC Design",
    description: "Optimizing neural network performance through custom ASIC and FPGA designs.",
    img: "/images/ai-hardware.jpg",
  },
  {
    id: 2,
    title: "Sensor Interfacing Circuits",
    description: "Advancing semiconductor architecture for high performance and efficiency.",
    img: "/images/vlsi.jpg",
  },
  {
    id: 3,
    title: "Low Power Bio-medical Circuits",
    description: "Rapid prototyping and real-time validation of hardware designs.",
    img: "/images/fpga.jpg",
  },
  {
    id: 4,
    title: "Embedded System Design",
    description: "Developing energy-efficient embedded architectures and IoT devices.",
    img: "/images/embedded.jpg",
  },
  {
    id: 5,
    title: "Measurement and Instrumentation",
    description: "Architectures for parallel computing, GPU/TPU-based acceleration.",
    img: "/images/hpc.jpg",
  },
];

export default function ResearchScope({ isDarkMode }: ResearchScopeProps) {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-800 to-gray-700'
    }`}>
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500`}></div>
      
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-white'
          }`}>
            Research Scope
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <p className={`mt-4 text-lg max-w-3xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-300'
          }`}>
            Explore our diverse research areas in integrated system design and hardware innovation
          </p>
        </motion.div>

        {/* Scope Cards Grid */}
          <div className="flex flex-wrap justify-center gap-6 ">
        {scopeData.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-sm ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-orange-400' : 'text-gray-900'
              }`}>
                {item.title}
              </h3>

              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.description}
              </p>

              <button className={`px-4 py-2 rounded-lg transition-all duration-300 w-full ${
                isDarkMode 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}>
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
        {/* View More Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mt-12 pt-8 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-600'
          }`}
        >
          <div className="text-center">
            <button className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50 text-orange-400 hover:bg-gray-800/80 hover:border-orange-500/30' 
                : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border border-gray-600/50 text-orange-400 hover:bg-gray-700/90 hover:border-orange-500/30'
            }`}>
              View All Research Areas
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}