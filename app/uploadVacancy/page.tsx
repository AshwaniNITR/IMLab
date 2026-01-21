// app/admin/vacancy/create/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  DollarSign, 
  Mail, 
  Tag, 
  Briefcase,
  Building,
  MapPin,
  Clock,
  AlertCircle,
  Save,
  X,
  CheckCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface PositionFormData {
  title: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  salaryRange: {
    min: string;
    max: string;
    currency: string;
  };
  applicationDeadline: string;
  numberOfOpenings: string;
}

interface VacancyFormData {
  content: string;
  isActive: boolean;
  expiryDate: string;
  tags: string[];
  department: string;
  positions: PositionFormData[];
  contactEmail: string;
  applicationInstructions: string;
}

export default function CreateVacancyPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<VacancyFormData>({
    content: '',
    isActive: true,
    expiryDate: '',
    tags: [],
    department: '',
    positions: [
      {
        title: '',
        description: '',
        requirements: [''],
        type: 'full-time',
        location: '',
        salaryRange: {
          min: '',
          max: '',
          currency: 'USD'
        },
        applicationDeadline: '',
        numberOfOpenings: '1'
      }
    ],
    contactEmail: '',
    applicationInstructions: 'Please submit your CV and cover letter to the email address provided.'
  });

  const [newTag, setNewTag] = useState('');
  const [currentRequirementIndex, setCurrentRequirementIndex] = useState(0);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validate form data
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        setLoading(false);
        return;
      }
      
      // Prepare data for API
      const apiData = {
        ...formData,
        positions: formData.positions.map(pos => ({
          ...pos,
          salaryRange: pos.salaryRange.min && pos.salaryRange.max ? {
            min: parseFloat(pos.salaryRange.min),
            max: parseFloat(pos.salaryRange.max),
            currency: pos.salaryRange.currency
          } : undefined,
          numberOfOpenings: parseInt(pos.numberOfOpenings) || 1,
          applicationDeadline: new Date(pos.applicationDeadline).toISOString()
        })),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        tags: formData.tags.filter(tag => tag.trim() !== '')
      };
      
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to create vacancy');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/vacancy');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vacancy');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    // Basic validation
    if (!formData.content.trim()) errors.push('Content is required');
    if (!formData.contactEmail.trim()) errors.push('Contact email is required');
    if (!formData.department.trim()) errors.push('Department is required');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      errors.push('Invalid email format');
    }
    
    // Validate each position
    formData.positions.forEach((position, index) => {
      if (!position.title.trim()) errors.push(`Position ${index + 1}: Title is required`);
      if (!position.description.trim()) errors.push(`Position ${index + 1}: Description is required`);
      if (!position.location.trim()) errors.push(`Position ${index + 1}: Location is required`);
      if (!position.applicationDeadline) errors.push(`Position ${index + 1}: Application deadline is required`);
      
      // Validate salary range if provided
      if (position.salaryRange.min || position.salaryRange.max) {
        const min = parseFloat(position.salaryRange.min);
        const max = parseFloat(position.salaryRange.max);
        
        if (isNaN(min) || isNaN(max)) {
          errors.push(`Position ${index + 1}: Invalid salary range numbers`);
        } else if (min > max) {
          errors.push(`Position ${index + 1}: Minimum salary cannot be greater than maximum salary`);
        }
      }
      
      // Validate requirements
      const validRequirements = position.requirements.filter(req => req.trim() !== '');
      if (validRequirements.length === 0) {
        errors.push(`Position ${index + 1}: At least one requirement is required`);
      }
    });
    
    return errors;
  };

  const handleInputChange = (field: keyof VacancyFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePositionChange = (index: number, field: keyof PositionFormData, value: any) => {
    setFormData(prev => {
      const newPositions = [...prev.positions];
      newPositions[index] = {
        ...newPositions[index],
        [field]: value
      };
      return { ...prev, positions: newPositions };
    });
  };

  const handleRequirementChange = (positionIndex: number, reqIndex: number, value: string) => {
    setFormData(prev => {
      const newPositions = [...prev.positions];
      const newRequirements = [...newPositions[positionIndex].requirements];
      newRequirements[reqIndex] = value;
      newPositions[positionIndex].requirements = newRequirements;
      return { ...prev, positions: newPositions };
    });
  };

  const addRequirement = (positionIndex: number) => {
    setFormData(prev => {
      const newPositions = [...prev.positions];
      newPositions[positionIndex].requirements.push('');
      return { ...prev, positions: newPositions };
    });
  };

  const removeRequirement = (positionIndex: number, reqIndex: number) => {
    setFormData(prev => {
      const newPositions = [...prev.positions];
      newPositions[positionIndex].requirements = newPositions[positionIndex].requirements.filter((_, i) => i !== reqIndex);
      return { ...prev, positions: newPositions };
    });
  };

  const addPosition = () => {
    setFormData(prev => ({
      ...prev,
      positions: [
        ...prev.positions,
        {
          title: '',
          description: '',
          requirements: [''],
          type: 'full-time',
          location: '',
          salaryRange: { min: '', max: '', currency: 'USD' },
          applicationDeadline: '',
          numberOfOpenings: '1'
        }
      ]
    }));
  };

  const removePosition = (index: number) => {
    if (formData.positions.length > 1) {
      setFormData(prev => ({
        ...prev,
        positions: prev.positions.filter((_, i) => i !== index)
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const currencyOptions = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY'];

  // Set default expiry date to 30 days from now
  useEffect(() => {
    const defaultExpiryDate = new Date();
    defaultExpiryDate.setDate(defaultExpiryDate.getDate() + 30);
    setFormData(prev => ({
      ...prev,
      expiryDate: defaultExpiryDate.toISOString().split('T')[0]
    }));
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-20 right-4 z-50"
          >
            <div className={`rounded-xl border p-6 shadow-2xl ${
              isDarkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-100 border-green-200'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-bold text-green-800 dark:text-green-300">Success!</h3>
                  <p className="text-sm text-green-700 dark:text-green-400">Vacancy created successfully</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent`}>
                Create New Vacancy
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Fill in the details below to post a new job opening
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        </motion.div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mb-6 p-4 rounded-lg border ${
                isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-100 border-red-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-bold text-red-800 dark:text-red-300">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Sections */}
          <div className="space-y-8">
            {/* Section 1: Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
            >
              <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Briefcase className="w-5 h-5" />
                Basic Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Department */}
                <div>
                  <label className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Building className="inline w-4 h-4 mr-2" />
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                    }`}
                    placeholder="e.g., Research & Development"
                    required
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Mail className="inline w-4 h-4 mr-2" />
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                    }`}
                    placeholder="hr@company.com"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Vacancy Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className={`block mb-2 font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Tag className="inline w-4 h-4 mr-2" />
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                      }`}
                      placeholder="Add a tag (press Enter)"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        isDarkMode 
                          ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                          : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          isDarkMode 
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' 
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="mt-6">
                <label className={`block mb-2 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Vacancy Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                  }`}
                  placeholder="Provide a detailed description of the vacancy. You can use markdown formatting."
                  required
                />
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Use markdown for formatting. Example: # Heading, **bold**, *italic*, - list items
                </p>
              </div>

              {/* Application Instructions */}
              <div className="mt-6">
                <label className={`block mb-2 font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Application Instructions
                </label>
                <textarea
                  value={formData.applicationInstructions}
                  onChange={(e) => handleInputChange('applicationInstructions', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                  }`}
                  placeholder="How should candidates apply?"
                />
              </div>

              {/* Active Status */}
              <div className="mt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Publish vacancy immediately
                  </span>
                </label>
              </div>
            </motion.div>

            {/* Section 2: Positions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`rounded-2xl p-6 ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Briefcase className="w-5 h-5" />
                  Positions ({formData.positions.length})
                </h2>
                <button
                  type="button"
                  onClick={addPosition}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Position
                </button>
              </div>

              {/* Position Forms */}
              <div className="space-y-8">
                {formData.positions.map((position, positionIndex) => (
                  <motion.div
                    key={positionIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl border ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        Position #{positionIndex + 1}
                      </h3>
                      {formData.positions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePosition(positionIndex)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDarkMode 
                              ? 'hover:bg-red-900/30 text-red-400' 
                              : 'hover:bg-red-100 text-red-500'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Position Form Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Position Title */}
                      <div className="md:col-span-2">
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Position Title *
                        </label>
                        <input
                          type="text"
                          value={position.title}
                          onChange={(e) => handlePositionChange(positionIndex, 'title', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                          placeholder="e.g., Senior Research Scientist"
                          required
                        />
                      </div>

                      {/* Position Type */}
                      <div>
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Employment Type *
                        </label>
                        <select
                          value={position.type}
                          onChange={(e) => handlePositionChange(positionIndex, 'type', e.target.value as any)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                        </select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <MapPin className="inline w-4 h-4 mr-2" />
                          Location *
                        </label>
                        <input
                          type="text"
                          value={position.location}
                          onChange={(e) => handlePositionChange(positionIndex, 'location', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                          placeholder="e.g., Remote, New York Office"
                          required
                        />
                      </div>

                      {/* Number of Openings */}
                      <div>
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Number of Openings *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={position.numberOfOpenings}
                          onChange={(e) => handlePositionChange(positionIndex, 'numberOfOpenings', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                          required
                        />
                      </div>

                      {/* Application Deadline */}
                      <div>
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <Clock className="inline w-4 h-4 mr-2" />
                          Application Deadline *
                        </label>
                        <input
                          type="date"
                          value={position.applicationDeadline}
                          onChange={(e) => handlePositionChange(positionIndex, 'applicationDeadline', e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      {/* Salary Range */}
                      <div className="md:col-span-2">
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <DollarSign className="inline w-4 h-4 mr-2" />
                          Salary Range (Optional)
                        </label>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <label className={`block mb-1 text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Min Salary
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={position.salaryRange.min}
                              onChange={(e) => {
                                const newSalaryRange = { ...position.salaryRange, min: e.target.value };
                                handlePositionChange(positionIndex, 'salaryRange', newSalaryRange);
                              }}
                              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                isDarkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                              }`}
                              placeholder="Min"
                            />
                          </div>
                          <div>
                            <label className={`block mb-1 text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Max Salary
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1000"
                              value={position.salaryRange.max}
                              onChange={(e) => {
                                const newSalaryRange = { ...position.salaryRange, max: e.target.value };
                                handlePositionChange(positionIndex, 'salaryRange', newSalaryRange);
                              }}
                              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                isDarkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                              }`}
                              placeholder="Max"
                            />
                          </div>
                          <div>
                            <label className={`block mb-1 text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Currency
                            </label>
                            <select
                              value={position.salaryRange.currency}
                              onChange={(e) => {
                                const newSalaryRange = { ...position.salaryRange, currency: e.target.value };
                                handlePositionChange(positionIndex, 'salaryRange', newSalaryRange);
                              }}
                              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                isDarkMode 
                                  ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                                  : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                              }`}
                            >
                              {currencyOptions.map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-end">
                            <div className={`w-full px-4 py-3 rounded-lg ${
                              isDarkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {position.salaryRange.min && position.salaryRange.max 
                                ? `${position.salaryRange.min} - ${position.salaryRange.max} ${position.salaryRange.currency}`
                                : 'Not specified'
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Position Description *
                        </label>
                        <textarea
                          value={position.description}
                          onChange={(e) => handlePositionChange(positionIndex, 'description', e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                          }`}
                          placeholder="Describe the position responsibilities, expectations, and day-to-day activities"
                          required
                        />
                      </div>

                      {/* Requirements */}
                      <div className="md:col-span-2">
                        <label className={`block mb-2 font-medium ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Requirements *
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            (At least one requirement)
                          </span>
                        </label>
                        <div className="space-y-3">
                          {position.requirements.map((requirement, reqIndex) => (
                            <div key={reqIndex} className="flex gap-3">
                              <input
                                type="text"
                                value={requirement}
                                onChange={(e) => handleRequirementChange(positionIndex, reqIndex, e.target.value)}
                                className={`flex-1 px-4 py-3 rounded-lg border transition-colors ${
                                  isDarkMode 
                                    ? 'bg-gray-800 border-gray-700 text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/50'
                                }`}
                                placeholder={`Requirement ${reqIndex + 1}`}
                              />
                              {position.requirements.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeRequirement(positionIndex, reqIndex)}
                                  className={`p-3 rounded-lg transition-colors ${
                                    isDarkMode 
                                      ? 'hover:bg-red-900/30 text-red-400' 
                                      : 'hover:bg-red-100 text-red-500'
                                  }`}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addRequirement(positionIndex)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                              isDarkMode 
                                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                            Add Requirement
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Form Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>Fields marked with * are required</p>
              <p>All data will be validated before submission</p>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Vacancy
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </form>
      </main>
      
      <Footer />
    </div>
  );
}