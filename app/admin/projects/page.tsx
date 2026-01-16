// app/projects/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/app/admin/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  status: 'ongoing' | 'completed';
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/researchProj');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      console.log(data.data);
      setProjects(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
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
            Research Projects
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 mx-auto mb-6 rounded-full"></div>
          <p className={`text-lg md:text-xl max-w-3xl mx-auto mb-8 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Explore our ongoing and completed research projects in integrated system design
          </p>
          
          {/* Stats and Add Button */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto mb-8">
            <div className={`p-4 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                  <Calendar className={`w-6 h-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {projects.length}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Total Projects
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <CheckCircle className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Completed
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50' 
                : 'bg-gradient-to-br from-gray-50 to-white border border-gray-200'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Clock className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {projects.filter(p => p.status === 'ongoing').length}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ongoing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className={`rounded-xl border p-8 text-center ${
              isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-100 border-red-200'
            }`}>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Unable to Load Projects
              </h3>
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {error}
              </p>
              <button 
                onClick={fetchProjects}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Projects List - Alternating Layout */}
        <div className="space-y-12">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {/* Image Section */}
                  <div className="lg:w-2/5 p-6 lg:p-8">
                    <div className="relative h-64 lg:h-full rounded-xl overflow-hidden">
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      {/* Status Badge */}
                      <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-semibold ${
                        project.status === 'completed'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      }`}>
                        {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-6 lg:p-8">
                    <div className="h-full flex flex-col">
                      {/* Project Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-3 h-8 rounded-full bg-gradient-to-b from-orange-500 to-orange-600`}></div>
                          <h2 className={`text-2xl lg:text-3xl font-bold ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {project.name}
                          </h2>
                        </div>
                        
                        {/* Date Info */}
                        <div className={`flex items-center gap-4 text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                          {project.updatedAt !== project.createdAt && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex-1 mb-6">
                        <div className={`prose max-w-none ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {project.description.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex} className="mb-4 last:mb-0">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-center py-16 rounded-2xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-4xl mb-4">🔬</div>
              <h3 className={`text-xl font-bold mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                No projects yet
              </h3>
              <p className={`mb-6 max-w-md mx-auto ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Be the first to add a research project to showcase your work.
              </p>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}