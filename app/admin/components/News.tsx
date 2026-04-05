'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  date: string;
}

interface NewsProps {
  isDarkMode: boolean;
}

export default function News({ isDarkMode }: NewsProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '' });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/news?limit=3&sortOrder=desc');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setNewsItems(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingId(item._id);
    setEditForm({
      title: item.title,
      description: item.description,
      date: new Date(item.date).toISOString().split('T')[0]
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        await fetchNews();
        setEditingId(null);
      } else {
        const error = await response.json();
        console.error('Update failed:', error.error);
      }
    } catch (error) {
      console.error('Error updating news:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchNews();
      } else {
        const error = await response.json();
        console.error('Delete failed:', error.error);
      }
    } catch (error) {
      console.error('Error deleting news:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '', date: '' });
  };

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
              className={`text-xs px-3 py-1 rounded-lg transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            >
              Refresh
            </button>
          </div>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
        </motion.div>

        {/* Custom Scrollable Area */}
        <div className="relative">
          <div className="max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
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
                      <div className="h-6 bg-gray-600/50 rounded mb-3 w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-gray-600/50 rounded mb-2 w-full animate-pulse"></div>
                      <div className="h-4 bg-gray-600/50 rounded mb-3 w-2/3 animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600/50"></div>
                        <div className="h-3 bg-gray-600/50 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                    whileHover={{ x: editingId !== item._id ? 3 : 0 }}
                    className={`group relative p-4 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:bg-gray-800/70 border border-gray-700/50' 
                        : 'bg-gradient-to-br from-gray-700/80 to-gray-800/80 hover:bg-gray-700/90 border border-gray-600/50'
                    } ${editingId === item._id ? 'ring-2 ring-orange-500' : ''}`}
                  >
                    {/* Left accent line */}
                    <div className={`absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gradient-to-b from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300`}></div>
                    
                    {/* Edit/Delete Buttons */}
                    {editingId !== item._id && (
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => handleEdit(item)}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-blue-600/80 hover:bg-blue-500 text-white' 
                              : 'bg-blue-500/80 hover:bg-blue-400 text-white'
                          }`}
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className={`p-1.5 rounded-lg transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-red-600/80 hover:bg-red-500 text-white' 
                              : 'bg-red-500/80 hover:bg-red-400 text-white'
                          } ${deletingId === item._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                    
                    {/* Content - Compact */}
                    <div className="pl-3 pr-16">
                      {editingId === item._id ? (
                        // Edit Form
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className={`w-full px-3 py-2 text-base rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-gray-600 border-gray-500 text-white'
                            }`}
                            placeholder="Title"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={2}
                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-gray-600 border-gray-500 text-white'
                            }`}
                            placeholder="Description"
                          />
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className={`w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                              isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-gray-600 border-gray-500 text-white'
                            }`}
                          />
                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleUpdate(item._id)}
                              className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isDarkMode 
                                  ? 'bg-green-600 hover:bg-green-500 text-white' 
                                  : 'bg-green-500 hover:bg-green-400 text-white'
                              }`}
                            >
                              <Check size={14} /> Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isDarkMode 
                                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                                  : 'bg-gray-500 hover:bg-gray-400 text-white'
                              }`}
                            >
                              <X size={14} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Display Content
                        <>
                          <h3 className={`text-lg font-bold mb-2 line-clamp-2 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-orange-400 transition-all duration-300`}>
                            {item.title}
                          </h3>
                          
                          <p className={`text-sm leading-relaxed mb-3 line-clamp-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-300'
                          }`}>
                            {item.description}
                          </p>
                          
                          <div className={`flex items-center gap-2 text-xs font-medium ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                          }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600"></div>
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </>
                      )}
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