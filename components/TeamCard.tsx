'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface TeamMemberCardProps {
  name: string;
  image: string;
  enrolledDate: string;
  graduatedDate?: string; // Made optional
  designation: string;
  description: string;
  isDarkMode: boolean;
  index?: number;
}

export default function TeamMemberCard({
  name,
  image,
  enrolledDate,
  graduatedDate,
  designation,
  description,
  isDarkMode,
  index = 0
}: TeamMemberCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const leftCardVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.2 + (index * 0.1),
        ease: "easeOut" as const
      }
    }
  };

  const rightCardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5,
        delay: 0.4 + (index * 0.1),
        ease: "easeOut" as const
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        delay: 0.3 + (index * 0.1),
        duration: 0.5,
        ease: "easeOut" as const
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <div ref={ref} className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Side - Profile Card */}
      <motion.div 
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={leftCardVariants}
        className="w-full lg:w-1/3"
      >
        <div className={`p-5 rounded-xl transition-all duration-300 relative overflow-hidden border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          
          <div className="flex flex-col items-center pt-4">
            {/* Circular Image with orange border */}
            <motion.div 
              variants={imageVariants}
              className="w-32 h-32 rounded-full overflow-hidden border-4 mb-4 transition-all duration-300 hover:border-orange-500 hover:scale-105"
              style={{
                borderColor: isDarkMode ? '#333' : '#e5e7eb'
              }}
            >
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Name */}
            <motion.h3 
              variants={textVariants}
              className={`text-xl font-bold text-center mb-1 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              {name}
            </motion.h3>

            {/* Designation in orange */}
            <motion.div 
              variants={textVariants}
              className={`text-sm font-medium mb-3 text-center px-4 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                  : 'bg-orange-100 text-orange-700 border border-orange-200'
              }`}
            >
              {designation}
            </motion.div>

            {/* Dates - Clean single line */}
            <motion.div 
              variants={textVariants}
              className={`text-xs text-center ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    isDarkMode ? 'bg-orange-500' : 'bg-orange-600'
                  }`}></div>
                  <span className="font-medium">Enrolled: {enrolledDate}</span>
                </div>
                {graduatedDate && (
                  <>
                    <span className={`${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}>/</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        isDarkMode ? 'bg-orange-400' : 'bg-orange-500'
                      }`}></div>
                      <span className="font-medium">Graduated: {graduatedDate}</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Description Card */}
      <motion.div 
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={rightCardVariants}
        className="w-full lg:w-2/3"
      >
        <div className={`p-6 rounded-xl transition-all duration-300 border ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          
          <div className="pt-2">
            {/* About heading with orange accent */}
            <motion.h1
              variants={textVariants}
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}
            >
              About {name.split(' ')[0]}
              <div className="h-0.5 w-12 mt-2 bg-orange-500 rounded-full"></div>
            </motion.h1>

            {/* Description text */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ 
                delay: 0.8 + (index * 0.1), 
                duration: 0.4,
                ease: "easeOut" as const
              }}
              className={`text-sm leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              {description.split('\n').map((paragraph, pIndex) => (
                <motion.p 
                  key={pIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.9 + (pIndex * 0.1) + (index * 0.1), 
                    duration: 0.3,
                    ease: "easeOut" as const
                  }}
                  className="mb-3"
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            {/* Optional: Minimal divider with orange accent */}
            <motion.div 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              transition={{ 
                delay: 1.1 + (index * 0.1), 
                duration: 0.5,
                ease: "easeOut" as const
              }}
              className="mt-6 pt-4 border-t"
              style={{
                borderColor: isDarkMode ? '#333' : '#e5e7eb'
              }}
            >
              <div className={`text-xs flex items-center gap-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>Integrated System Design Lab • NIT Rourkela</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}