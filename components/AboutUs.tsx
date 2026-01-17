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
      <div
  className={`space-y-6 text-lg leading-relaxed ${
    isDarkMode ? 'text-gray-300' : 'text-gray-700'
  }`}
>
  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    The{' '}
    <span
      className={`font-semibold ${
        isDarkMode ? 'text-orange-400' : 'text-orange-600'
      }`}
    >
      Integrated System Design Lab
    </span>{' '}
    at NIT Rourkela focuses on research and development in{' '}
    <span
      className={`font-semibold ${
        isDarkMode ? 'text-orange-400' : 'text-orange-600'
      }`}
    >
      integrated circuit design
    </span>{' '}
    for conventional electronic systems as well as Micro-Sensors (MEMS).
  </motion.p>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    The laboratory assumes a leadership role in the development of{' '}
    <span
      className={`font-semibold ${
        isDarkMode ? 'text-orange-400' : 'text-orange-600'
      }`}
    >
      sensor interfacing and analog IC design
    </span>
    , with particular emphasis on MEMS capacitive accelerometers, embedded
    instrumentation, and low-power circuit techniques.
  </motion.p>

  <motion.p
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    Research areas include analog and mixed-signal IC design, embedded systems,
    instrumentation, MEMS capacitive sensors, biomedical and neuromorphic
    circuits, and complete system integration from design to testing. Students
    in the lab gain hands-on expertise across the full IC development cycle and
    sensor-integrated system validation.
  </motion.p>
</div>


        {/* Accent line */}
      
      </div>
    </motion.div>
  );
}