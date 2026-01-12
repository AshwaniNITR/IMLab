// components/News.tsx
'use client';

import { motion } from 'framer-motion';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface NewsProps {
  isDarkMode: boolean;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Lab Wins Research Grant for Advanced Computing",
    description: "New grant to advance AI hardware through innovative architectures",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Professor Receives Technical Excellence Award",
    description: "Recognition for pioneering contributions to AI hardware",
    date: "5 days ago",
  },
  {
    id: 3,
    title: "New Collaboration with Industry Partner",
    description: "Strategic partnership to advance semiconductor research",
    date: "1 week ago",
  },
];

export default function News({ isDarkMode }: NewsProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-800 to-gray-700'
    }`}>
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500`}></div>
      
      <div className="p-6">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className={`text-2xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-white'
          }`}>
            Latest News
          </h2>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </motion.div>

        {/* Custom Scrollable Area */}
        <div className="relative">
          <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-4">
              {newsItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.08
                  }}
                  whileHover={{ x: 3 }}
                  className={`group relative p-4 rounded-xl transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:bg-gray-800/70 border border-gray-700/50' 
                      : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50'
                  }`}
                >
                  {/* Left accent line */}
                  <div className={`absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gradient-to-b from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300`}></div>
                  
                  {/* Content - Compact */}
                  <div className="pl-3">
                    {/* Title - Smaller */}
                    <h3 className={`text-lg font-bold mb-2 line-clamp-2 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-400 transition-all duration-300`}>
                      {item.title}
                    </h3>
                    
                    {/* Description - Smaller */}
                    <p className={`text-sm leading-relaxed mb-3 line-clamp-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-300'
                    }`}>
                      {item.description}
                    </p>
                    
                    {/* Date - Smaller */}
                    <div className={`flex items-center gap-2 text-xs font-medium ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-400'
                    }`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Scroll gradient fade effect */}
          <div className={`absolute bottom-0 left-0 right-3 h-6 bg-gradient-to-t ${
            isDarkMode ? 'from-gray-900 to-transparent' : 'from-gray-800 to-transparent'
          } pointer-events-none`}></div>
        </div>

        {/* View all link - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={`mt-6 pt-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-600'
          }`}
        >
          <div className="text-center">
            <button className={`text-sm font-medium transition-all duration-300 hover:underline ${
              isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-400 hover:text-orange-300'
            }`}>
              View All News
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add custom scrollbar styles to global.css */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f97316 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? 'rgba(31, 41, 55, 0.3)' : 'rgba(55, 65, 81, 0.3)'};
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ea580c);
          border-radius: 10px;
          border: 2px solid ${isDarkMode ? 'rgb(31, 41, 55)' : 'rgb(55, 65, 81)'};
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #fb923c, #f97316);
        }
      `}</style>
    </div>
  );
}