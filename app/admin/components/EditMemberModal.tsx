// components/EditMemberModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TeamMember {
  _id: string;
  name: string;
  imageUrl: string;
  imagePublicId: string;
  enrolledDate: string;
  graduatedDate?: string;
  designation: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onUpdate: (updatedMember: TeamMember) => Promise<{ success: boolean; error?: any }>;
  isDarkMode: boolean;
}

export default function EditMemberModal({
  isOpen,
  onClose,
  member,
  onUpdate,
  isDarkMode
}: EditMemberModalProps) {
  const [formData, setFormData] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData(member);
      setError('');
      setSuccess(false);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: value
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const result = await onUpdate(formData);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(result.error?.message || 'Failed to update member');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="backdrop-blur-lg flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
       

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} px-6 pt-6 pb-6 sm:p-8`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Edit Team Member
                </h3>
                <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Update member information
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
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two-column layout for desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Profile Image Preview */}
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-orange-500">
                      <img
                        src={formData.imageUrl}
                        alt={formData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p className="text-sm">Image URL</p>
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Designation
                      </label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Enrolled Date
                      </label>
                      <input
                        type="date"
                        name="enrolledDate"
                        value={new Date(formData.enrolledDate).toISOString().split('T')[0]}
                        onChange={handleChange}
                        required
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Graduated Date (Optional)
                      </label>
                      <input
                        type="date"
                        name="graduatedDate"
                        value={formData.graduatedDate ? new Date(formData.graduatedDate).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } resize-none`}
                    />
                  </div>

                  {/* Hidden fields */}
                  <input type="hidden" name="imagePublicId" value={formData.imagePublicId} />
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
                    Member updated successfully!
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isSubmitting
                      ? 'bg-orange-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                  } text-white shadow-md hover:shadow-lg`}
                >
                  {isSubmitting ? 'Updating...' : 'Update Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}