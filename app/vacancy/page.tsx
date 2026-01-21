// app/vacancy/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

interface VacancyData {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function VacancyPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [vacancy, setVacancy] = useState<VacancyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchVacancy();
  }, []);

  const fetchVacancy = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/getVac');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vacancy information');
      }
      
      const data = await response.json();
      setVacancy(data.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vacancy information');
      console.error('Error fetching vacancy:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-96">
            <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${isDarkMode ? 'border-orange-500' : 'border-orange-500'}`}></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent`}>
            Vacancy Announcements
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Explore current job openings and research opportunities in our lab
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className={`rounded-xl border p-8 text-center ${
              isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-100 border-red-200'
            }`}>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Unable to Load Vacancy Information
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {error}
              </p>
              <button 
                onClick={fetchVacancy}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Vacancy Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
          }`}>
            {/* Header with Info */}
            <div className={`px-8 py-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-8 rounded-full bg-gradient-to-b from-orange-500 to-orange-600`}></div>
                <h2 className={`text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Current Openings
                </h2>
              </div>
              
              {/* Last Updated Info */}
              {vacancy && (
                <div className={`flex items-center gap-6 text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Posted: {formatDate(vacancy.createdAt)}</span>
                  </div>
                  {vacancy.updatedAt !== vacancy.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated: {formatDate(vacancy.updatedAt)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-8">
              {vacancy && vacancy.content ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className={`prose max-w-none ${
                    isDarkMode 
                      ? 'prose-invert text-gray-300' 
                      : 'text-gray-700'
                  }`}>
                    {vacancy.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph || <br />}
                      </p>
                    ))}
                  </div>
                  
                  {/* Note */}
                  <div className={`mt-8 p-4 rounded-lg ${
                    isDarkMode 
                      ? 'bg-blue-900/30 border border-blue-800/50' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          isDarkMode ? 'text-blue-300' : 'text-blue-800'
                        }`}>
                          Application Information
                        </h4>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-blue-200/80' : 'text-blue-700'
                        }`}>
                          Please follow the application instructions provided above. For any queries, contact our administration office.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className={`text-6xl mb-6 ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    📋
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    No Vacancies Available
                  </h3>
                  <p className={`text-lg max-w-md mx-auto mb-8 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    We currently don't have any open positions. Please keep checking our site for future opportunities.
                  </p>
                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300'
                  }`}>
                    <Clock className="w-4 h-4" />
                    Last checked: {new Date().toLocaleDateString()}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`mt-8 p-6 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50' 
                : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className={`text-lg font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Stay Updated
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  New positions are posted regularly. Check back often or subscribe to our newsletter.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={fetchVacancy}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white' 
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800'
                  }`}
                >
                  Refresh List
                </button>
                <button className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}>
                  Contact HR
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
}