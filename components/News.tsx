// components/News.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewsProps {
  isDarkMode: boolean;
}

interface ApiResponse {
  success: boolean;
  data: NewsItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Helper function to format date as "time ago"
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

export default function News({ isDarkMode }: NewsProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);

  // Fetch news data from API
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data) {
        setNewsItems(data.data);
        setPagination(data.pagination! || null);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    
    // Optional: Set up polling to refresh news periodically
    const refreshInterval = setInterval(fetchNews, 300000); // Refresh every 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Loading skeleton component
  const NewsSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`group relative p-4 rounded-xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
              : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border border-gray-600/50'
          }`}
        >
          <div className="pl-3">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-600/50 rounded mb-3 w-3/4 animate-pulse"></div>
            {/* Description skeleton */}
            <div className="h-4 bg-gray-600/50 rounded mb-2 w-full animate-pulse"></div>
            <div className="h-4 bg-gray-600/50 rounded mb-3 w-2/3 animate-pulse"></div>
            {/* Date skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
              <div className="h-3 bg-gray-600/50 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error display component
  const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`p-6 rounded-xl text-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-700/30' 
          : 'bg-gradient-to-br from-red-800/20 to-red-700/20 border border-red-600/30'
      }`}
    >
      <div className="text-red-400 mb-3">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300"
      >
        Retry
      </button>
    </motion.div>
  );

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
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-white'
            }`}>
              Latest News
            </h2>
            <button
              onClick={fetchNews}
              disabled={loading}
              className={`text-xs font-medium px-3 py-1 rounded-lg transition-all duration-300 ${
                loading 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : isDarkMode 
                    ? 'bg-gray-800 text-orange-400 hover:bg-gray-700 hover:text-orange-300' 
                    : 'bg-gray-700 text-orange-400 hover:bg-gray-600 hover:text-orange-300'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing
                </span>
              ) : 'Refresh'}
            </button>
          </div>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </motion.div>

        {/* Custom Scrollable Area */}
        <div className="relative">
          <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <NewsSkeleton />
            ) : error ? (
              <ErrorDisplay message={error} onRetry={fetchNews} />
            ) : newsItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-6 rounded-xl text-center ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                    : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border border-gray-600/50'
                }`}
              >
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="text-sm font-medium">No news available</p>
                  <p className="text-xs mt-1">Check back later for updates</p>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {newsItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.08
                    }}
                    whileHover={{ x: 3 }}
                    className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:bg-gray-800/70 border border-gray-700/50' 
                        : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50'
                    }`}
                    onClick={() => {
                      // Optional: Add click handler for news item
                      console.log('News item clicked:', item._id);
                    }}
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
                      
                      {/* Date - Dynamic */}
                      <div className={`flex items-center gap-2 text-xs font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-400'
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
                        <span>{formatTimeAgo(item.date! )}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Scroll gradient fade effect */}
          <div className={`absolute bottom-0 left-0 right-3 h-6 bg-gradient-to-t ${
            isDarkMode ? 'from-gray-900 to-transparent' : 'from-gray-800 to-transparent'
          } pointer-events-none`}></div>
        </div>

        {/* View all link and stats - Compact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className={`mt-6 pt-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-600'
          }`}
        >
          <div className="flex justify-between items-center text-sm">
            <div className={`font-medium ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              {pagination && (
                <span>Showing {newsItems.length} of {pagination.total}</span>
              )}
            </div>
            <button 
              className={`font-medium transition-all duration-300 hover:underline ${
                isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-400 hover:text-orange-300'
              }`}
              onClick={() => {
                // Optional: Navigate to full news page
                console.log('View all news clicked');
                // Or: router.push('/news');
              }}
            >
              View All News →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Add custom scrollbar styles */}
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