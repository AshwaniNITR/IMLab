// components/ResearchScope.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ResearchScopeProps {
  isDarkMode: boolean;
}

interface ScopeItem {
  _id: string;
  title: string;
  brief?: string;
  imageUrlOne?: string;
  description?:string;
  img?: string;
  // Add other fields from your schema if needed
}

export default function ResearchScope({ isDarkMode }: ResearchScopeProps) {
  const [scopeData, setScopeData] = useState<ScopeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchScopeData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/rscope');
        
        if (!response.ok) {
          throw new Error('Failed to fetch research scope data');
        }
        
        const data = await response.json();
        
        // Map the API response to match the expected format
        const formattedData = data.projects.map((project: any) => ({
          _id: project._id,
          title: project.title,
          description: project.brief, // Using brief as description
          img: project.imageUrlOne,
        }));
        
        setScopeData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching research scope:', err);
        setError('Failed to load research scope data');
        // Fallback to static data if API fails
        setScopeData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScopeData();
  }, []);

  // Fallback data in case API fails
  const fallbackData: ScopeItem[] = [
    {
      _id: '1',
      title: "Analog IC Design",
      description: "Optimizing neural network performance through custom ASIC and FPGA designs.",
      img: "/images/ai-hardware.jpg",
    },
    {
      _id: '2',
      title: "Sensor Interfacing Circuits",
      description: "Advancing semiconductor architecture for high performance and efficiency.",
      img: "/images/vlsi.jpg",
    },
    {
      _id: '3',
      title: "Low Power Bio-medical Circuits",
      description: "Rapid prototyping and real-time validation of hardware designs.",
      img: "/images/fpga.jpg",
    },
    {
      _id: '4',
      title: "Embedded System Design",
      description: "Developing energy-efficient embedded architectures and IoT devices.",
      img: "/images/embedded.jpg",
    },
    {
      _id: '5',
      title: "Measurement and Instrumentation",
      description: "Architectures for parallel computing, GPU/TPU-based acceleration.",
      img: "/images/hpc.jpg",
    },
  ];

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-300">Showing fallback data</p>
          </div>
        )}

        {/* Scope Cards Grid */}
        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-6">
            {(scopeData.length > 0 ? scopeData : fallbackData).map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                {/* Image with fallback */}
                <div className="w-full h-40 overflow-hidden bg-gray-800">
                  {item.img ? (
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback image if the URL fails
                        e.currentTarget.src = "/images/placeholder.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                    isDarkMode ? 'text-orange-400' : 'text-gray-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm mb-4 transition-colors duration-300 line-clamp-3 ${
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
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && scopeData.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-4">No research scope data available</p>
            <button 
              onClick={() => window.location.href = '/add-rscope'}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Research Scope
            </button>
          </div>
        )}

        {/* View More Section */}
        {scopeData.length > 0 && !isLoading && (
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
        )}
      </div>
    </div>
  );
}