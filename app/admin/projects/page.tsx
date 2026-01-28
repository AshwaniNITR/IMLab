// app/projects/page.tsx - ALTERNATIVE VERSION
// This version sends the image file directly to the PATCH endpoint
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/app/admin/components/Navbar';
import Footer from '@/components/Footer';
import { Plus, Calendar, CheckCircle, Clock, Pencil, X, Upload, Image as ImageIcon } from 'lucide-react';

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
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (updatedProject: Project, imageFile?: File) => {
    try {
      setIsSubmitting(true);
      
      // Send as FormData if there's an image, otherwise as JSON
      let response;
      
      if (imageFile) {
        // Send as FormData with image
        const formData = new FormData();
        formData.append('name', updatedProject.name);
        formData.append('status', updatedProject.status);
        formData.append('description', updatedProject.description);
        formData.append('image', imageFile);
        
        response = await fetch(`/api/researchProj/${updatedProject._id}`, {
          method: 'PATCH',
          body: formData,
        });
      } else {
        // Send as JSON without image change
        response = await fetch(`/api/researchProj/${updatedProject._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: updatedProject.name,
            status: updatedProject.status,
            description: updatedProject.description,
            imageUrl: updatedProject.imageUrl, // Keep existing URL
          }),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update project');
      }

      // Update local state
      setProjects(prev => prev.map(project => 
        project._id === updatedProject._id ? result.data : project
      ));
      
      // Close modal
      setIsEditModalOpen(false);
      setEditingProject(null);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error updating project:', error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
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
                className={`rounded-2xl overflow-hidden transition-all duration-300 relative group ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                }`}
              >
                {/* Edit Button */}
                <button
                  onClick={() => handleEditClick(project)}
                  className={`absolute top-4 right-4 z-10 p-2 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  } shadow-md hover:shadow-lg`}
                >
                  <Pencil className="w-5 h-5" />
                </button>

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

      {/* Edit Project Modal */}
      {isEditModalOpen && editingProject && (
        <EditProjectModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProject(null);
          }}
          project={editingProject}
          onUpdate={handleUpdateProject}
          isDarkMode={isDarkMode}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}

// Edit Project Modal Component
interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdate: (updatedProject: Project, imageFile?: File) => Promise<{ success: boolean; error?: any }>;
  isDarkMode: boolean;
  isSubmitting: boolean;
}

function EditProjectModal({
  isOpen,
  onClose,
  project,
  onUpdate,
  isDarkMode,
  isSubmitting
}: EditProjectModalProps) {
  const [formData, setFormData] = useState<Project>(project);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    setFormData(project);
    setError('');
    setSuccess(false);
    setImageFile(null);
    setImagePreview('');
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.name || !formData.description) {
      setError('Name and Description are required fields');
      return;
    }

    const result = await onUpdate(formData, imageFile || undefined);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setError(result.error?.message || 'Failed to update project');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 transition-opacity ${isDarkMode ? 'bg-black' : 'bg-gray-500'} bg-opacity-75`}
          onClick={onClose}
        />

        {/* Modal - SCROLLABLE */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl relative z-10">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} max-h-[90vh] overflow-y-auto`}>
            <div className="px-6 pt-6 pb-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Edit Research Project
                  </h3>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Update project information
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Project Name */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status *
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      } focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                    >
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Project Image
                    </label>
                    
                    {/* Current Image Preview */}
                    {(imagePreview || formData.imageUrl) && (
                      <div className="mb-3">
                        <div className={`text-xs mb-1 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {imagePreview ? '✓ New Image Selected (will replace current on save)' : 'Current Image'}
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-dashed">
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          {imagePreview && (
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                isDarkMode ? 'bg-green-500/90 text-white' : 'bg-green-500 text-white'
                              }`}>
                                New Image
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="space-y-2">
                      <label className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 hover:border-orange-500 bg-gray-700/50 hover:bg-gray-700' 
                          : 'border-gray-300 hover:border-orange-500 bg-gray-50 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Upload className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {imageFile ? `Selected: ${imageFile.name}` : 'Upload new image (optional)'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Supported: JPG, PNG, GIF (Max 5MB). Leave empty to keep current image.
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                      } resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20`}
                      placeholder="Describe the research project..."
                    />
                  </div>
                </div>

                {/* Status Messages */}
                {error && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border`}>
                    <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
                  </div>
                )}

                {success && (
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border`}>
                    <p className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Project updated successfully!
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className={`flex justify-end space-x-3 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                      isSubmitting
                        ? 'bg-orange-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                    } text-white shadow-md hover:shadow-lg`}
                  >
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {isSubmitting ? 'Updating...' : 'Update Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}