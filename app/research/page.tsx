// app/research/page.tsx
'use client';
import Navbar from '@/components/Navbar';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';


interface ResearchItem {
  _id: string;
  title: string;
  description: string;
  brief: string;
  imageUrlOne: string;
  imageUrlTwo: string;
  createdAt: string;
}

export default function Research() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [researchData, setResearchData] = useState<ResearchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollToItemId, setScrollToItemId] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Check for scrollToItemId on mount
  useEffect(() => {
    const storedItemId = sessionStorage.getItem('scrollToItemId');
    if (storedItemId) {
      setScrollToItemId(storedItemId);
      // Clear it after reading
      sessionStorage.removeItem('scrollToItemId');
    }
  }, []);

  // Fetch data from API
  useEffect(() => {
    const fetchResearchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/rscope');
        
        if (!response.ok) {
          throw new Error('Failed to fetch research data');
        }
        
        const data = await response.json();
        
        // Map API data to our format
        const formattedData = data.projects?.map((item: any) => ({
          _id: item._id,
          title: item.title,
          description: item.description,
          brief: item.brief,
          imageUrlOne: item.imageUrlOne,
          imageUrlTwo: item.imageUrlTwo,
          createdAt: item.createdAt
        })) || [];
        
        setResearchData(formattedData);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching research data:', err);
        setError(err.message || 'Failed to load research data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearchData();
  }, []);

  // Scroll to specific item after data is loaded
  useEffect(() => {
    if (scrollToItemId && researchData.length > 0 && !isLoading) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = itemRefs.current[scrollToItemId];
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
          
          // Add highlight effect
          element.classList.add('ring-4', 'ring-orange-500/50');
          setTimeout(() => {
            element.classList.remove('ring-4', 'ring-orange-500/50');
          }, 2000);
        }
        setScrollToItemId(null);
      }, 300);
    }
  }, [scrollToItemId, researchData, isLoading]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className='text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent'>
            Research Scope
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
           <p className={`text-lg max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
           Explore our cutting-edge research in IC Design, Sensor Interfacing Circuits and Integrated System Design.
          </p>
        
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                Loading research projects...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center my-8">
            <p className="text-red-400 font-medium mb-2">Error Loading Data</p>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Research Projects */}
        {!isLoading && researchData.length > 0 && (
          <div className="space-y-16">
            {researchData.map((item, index) => {
              const isImageLeft = index % 2 === 0;
              
              return (
                <div
                  key={item._id}
                  ref={(el) => {
                    if (el) {
                      itemRefs.current[item._id] = el;
                    }
                  }}
                  className="transition-all duration-300"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`rounded-2xl overflow-hidden shadow-2xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <div className="p-8">
                      <div className={`flex flex-col lg:flex-row gap-8 items-center ${
                        isImageLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'
                      }`}>
                        {/* Image Section */}
                        <div className="lg:w-1/2 w-full">
                          <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <img
                              src={item.imageUrlTwo || item.imageUrlOne}
                              alt={item.title}
                              className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                // Fallback to imageUrlOne if imageUrlTwo fails
                                if (item.imageUrlOne && e.currentTarget.src !== item.imageUrlOne) {
                                  e.currentTarget.src = item.imageUrlOne;
                                } else {
                                  // Fallback placeholder
                                  e.currentTarget.src = '/images/placeholder.jpg';
                                  e.currentTarget.classList.add('opacity-50');
                                }
                              }}
                            />
                            <div className={`absolute inset-0 border-2 ${
                              isDarkMode ? 'border-gray-700/30' : 'border-gray-200/30'
                            } rounded-xl pointer-events-none`}></div>
                          </div>
                          
                          {/* Brief Section below image */}
                          {/* <div className="mt-6">
                            <h3 className={`text-lg font-semibold mb-3 ${
                              isDarkMode ? 'text-orange-400' : 'text-orange-600'
                            }`}>
                              Project Brief
                            </h3>
                            <p className={`text-sm leading-relaxed ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {item.brief}
                            </p>
                          </div> */}
                        </div>

                        {/* Content Section */}
                        <div className="lg:w-1/2 w-full">
                          <div className="mb-4">
                         
                   
                          </div>

                          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {item.title}
                          </h2>

                          <div className={`text-lg leading-relaxed mb-6 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {item.description}
                          </div>

                      
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && researchData.length === 0 && !error && (
          <div className="text-center py-20">
            <div className={`text-6xl mb-6 ${
              isDarkMode ? 'text-gray-700' : 'text-gray-300'
            }`}>🔬</div>
            <h2 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No Research Projects Found
            </h2>
            <p className={`text-lg mb-8 max-w-md mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              There are no research projects available at the moment.
            </p>
            <button
              onClick={() => window.location.href = '/add-rscope'}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg"
            >
              Add Research Project
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </main>
  );
}