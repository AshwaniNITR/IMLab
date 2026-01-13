// components/RecentPublications.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface PublicationItem {
  _id: string;
  title: string;
  author?: string;
  venue?: string;
  year: number;
  type: 'Journal' | 'Conference' | 'book-chapter' | 'patent';
}

interface RecentPublicationsProps {
  isDarkMode: boolean;
}

const typeLabels = {
  'Journal': 'Journal Publications',
  'Conference': 'Conference Papers',
  'book-chapter': 'Book Chapters',
  'patent': 'Patents'
};

const typeColors = {
  'Journal': 'bg-gradient-to-r from-blue-500 to-blue-600',
  'Conference': 'bg-gradient-to-r from-purple-500 to-purple-600',
  'book-chapter': 'bg-gradient-to-r from-amber-500 to-amber-600',
  'patent': 'bg-gradient-to-r from-green-500 to-green-600'
};

export default function RecentPublications({ isDarkMode }: RecentPublicationsProps) {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Group publications by type and get top 3 for each
  const groupedPublications = publications.reduce((acc, pub) => {
    if (!acc[pub.type]) {
      acc[pub.type] = [];
    }
    if (acc[pub.type].length < 3) {
      acc[pub.type].push(pub);
    }
    return acc;
  }, {} as Record<string, PublicationItem[]>);

  // Ensure all types are present even if no data
  const allTypes: Array<'Journal' | 'Conference' | 'book-chapter' | 'patent'> = ['Journal', 'Conference', 'book-chapter', 'patent'];
  allTypes.forEach(type => {
    if (!groupedPublications[type]) {
      groupedPublications[type] = [];
    }
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects?limit=20&sort=year:-1');
      
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }
      
      const data = await response.json();
      
      // Sort by year descending and filter to ensure unique types
      const sortedPublications = data.projects
        .sort((a: PublicationItem, b: PublicationItem) => b.year - a.year)
        .reduce((acc: PublicationItem[], pub: PublicationItem) => {
          // Ensure we only take the first 3 of each type
          const typeCount = acc.filter(p => p.type === pub.type).length;
          if (typeCount < 3) {
            acc.push(pub);
          }
          return acc;
        }, []);
      
      setPublications(sortedPublications);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load publications');
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render bullet list section
  const renderBulletSection = (
    type: 'Journal' | 'Conference' | 'book-chapter' | 'patent',
    publications: PublicationItem[],
    isLeftColumn: boolean
  ) => {
    const title = typeLabels[type];
    const colorClass = typeColors[type];

    return (
      <div className={`h-full ${isLeftColumn ? 'lg:pr-4' : 'lg:pl-4'}`}>
        <div className={`h-full rounded-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50' 
            : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 border border-gray-600/50'
        }`}>
          <div className="p-6 h-full flex flex-col">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-3 h-8 rounded-full ${colorClass}`}></div>
              <h3 className={`text-xl lg:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-white'
              }`}>
                {title}
              </h3>
            </div>
            
            {/* Publication List */}
            <div className="flex-1 space-y-4">
              {publications.length > 0 ? (
                publications
                  .sort((a, b) => b.year - a.year)
                  .map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.4,
                        delay: index * 0.1
                      }}
                      whileHover={{ x: 5 }}
                      className={`group cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'hover:bg-gray-800/50' 
                          : 'hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="py-3">
                        {/* Bullet point */}
                        <div className="flex items-start gap-4">
                          <div className="relative flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${colorClass} group-hover:scale-125 transition-transform duration-300`}></div>
                            <div className={`absolute left-1.5 top-3 w-0.5 h-full ${
                              index === publications.length - 1 ? 'h-0' : 'h-full'
                            } ${colorClass.replace('bg-', 'bg-')} opacity-30`}></div>
                          </div>
                          
                          {/* Publication Title */}
                          <div className="flex-1">
                            <p className={`text-sm lg:text-base leading-relaxed font-medium group-hover:underline transition-all duration-300 line-clamp-2 ${
                              isDarkMode ? 'text-gray-300 group-hover:text-orange-300' : 'text-gray-300 group-hover:text-orange-300'
                            }`}>
                              {item.title}
                            </p>
                            
                            {/* Year */}
                            <div className="mt-1">
                               <span className={`text-xs px-2 py-1 rounded ${
                                isDarkMode 
                                  ? 'bg-gray-700/50 text-gray-400' 
                                  : 'bg-gray-600/50 text-gray-400'
                              }`}>
                                {item.author}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                isDarkMode 
                                  ? 'bg-gray-700/50 text-gray-400' 
                                  : 'bg-gray-600/50 text-gray-400'
                              }`}>
                                {item.year}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
              ) : (
                <div className={`text-center py-8 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  No publications available
                </div>
              )}
            </div>
            
            {/* View More Button */}
            <div className="mt-6 pt-6 border-t" style={{
              borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(75, 85, 99, 0.5)'
            }}>
              <button
                onClick={() => window.location.href = `/publication?type=${type}`}
                className={`w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50 text-orange-400 hover:bg-gray-800/80 hover:border-orange-500/30' 
                    : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border border-gray-600/50 text-orange-400 hover:bg-gray-700/90 hover:border-orange-500/30'
                }`}
              >
                View More {title}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-800 to-gray-700'
      }`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500`}></div>
        <div className="p-8">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
              isDarkMode ? 'border-orange-500' : 'border-orange-500'
            }`}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-800 to-gray-700'
      }`}>
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500`}></div>
        <div className="p-8">
          <div className="text-center py-8">
            <div className={`text-red-400 mb-4`}>⚠️</div>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-300'}`}>
              {error}
            </p>
            <button
              onClick={fetchPublications}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
              }`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Recent Publications
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
          <p className={`mt-4 text-lg max-w-3xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-300'
          }`}>
            Research contributions categorized by type and sorted by publication year
          </p>
        </motion.div>

        {/* Publications Grid - 2x2 Layout */}
        <div className="space-y-8 lg:space-y-0">
          {/* First Row: Journal and Conference */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderBulletSection('Journal', groupedPublications['Journal'], true)}
            {renderBulletSection('Conference', groupedPublications['Conference'], false)}
          </div>
          
          {/* Second Row: Patent and Book Chapter */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderBulletSection('patent', groupedPublications['patent'], true)}
            {renderBulletSection('book-chapter', groupedPublications['book-chapter'], false)}
          </div>
        </div>

        {/* View All Publications Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mt-12 pt-8 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-600'
          }`}
        >
          <div className="text-center">
            <button
              onClick={() => window.location.href = '/publication'}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-800/60 to-gray-900/60 border border-gray-700/50 text-orange-400 hover:bg-gray-800/80 hover:border-orange-500/30' 
                  : 'bg-gradient-to-r from-gray-700/80 to-gray-800/80 border border-gray-600/50 text-orange-400 hover:bg-gray-700/90 hover:border-orange-500/30'
              }`}
            >
              Browse All Publications
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}