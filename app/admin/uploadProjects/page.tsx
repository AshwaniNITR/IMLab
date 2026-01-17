'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '@/app/admin/components/Navbar';

type ProjectFormData = {
  name: string;
  status: 'ongoing' | 'completed';
  description: string;
  photo: File | null;
};

export default function AddProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
   const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  
  // Array of forms with image previews
  const [forms, setForms] = useState<{
    data: ProjectFormData;
    photoPreview: string | null;
  }[]>([{
    data: {
      name: '',
      status: 'ongoing',
      description: '',
      photo: null,
    },
    photoPreview: null,
  }]);

  const handlePhotoChange = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedForms = [...forms];
      updatedForms[index] = {
        ...updatedForms[index],
        data: { ...updatedForms[index].data, photo: file },
        photoPreview: reader.result as string,
      };
      setForms(updatedForms);
    };
    reader.readAsDataURL(file);
  };

  const addNewForm = () => {
    setForms([
      ...forms,
      {
        data: {
          name: '',
          status: 'ongoing',
          description: '',
          photo: null,
        },
        photoPreview: null,
      },
    ]);
  };

  const removeForm = (index: number) => {
    if (forms.length === 1) {
      // Don't remove the last form
      alert('At least one project form is required');
      return;
    }
    const updatedForms = [...forms];
    updatedForms.splice(index, 1);
    setForms(updatedForms);
  };

  const updateFormData = (index: number, field: keyof ProjectFormData, value: string) => {
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      data: { ...updatedForms[index].data, [field]: value },
    };
    setForms(updatedForms);
  };

  const validateForms = () => {
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i].data;
      if (!form.name || !form.photo || !form.description) {
        return `Please fill in all required fields for project ${i + 1}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validation
      const validationError = validateForms();
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Create FormData with all projects
      const formData = new FormData();
      
      // Add each project's data
      forms.forEach((form, index) => {
        const data = form.data;
        formData.append(`projects[${index}][name]`, data.name);
        formData.append(`projects[${index}][status]`, data.status);
        formData.append(`projects[${index}][description]`, data.description);
        if (data.photo) {
          formData.append(`projects[${index}][photo]`, data.photo);
        }
      });

      // Submit to API
      const response = await fetch('/api/researchProj', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add projects');
      }

      setSuccess(true);
      
      // Reset form
      setForms([{
        data: {
          name: '',
          status: 'ongoing',
          description: '',
          photo: null,
        },
        photoPreview: null,
      }]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/projects');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
     className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme}/>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add Projects
              </h1>
              <p className="text-gray-600">
                Fill in the details to add new projects
              </p>
            </div>
            <button
              type="button"
              onClick={addNewForm}
              className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Plus size={20} />
              Add Another Project
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              Projects added successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {forms.map((form, index) => (
              <div key={index} className="space-y-6 mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Project {index + 1}
                  </h3>
                  {forms.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeForm(index)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  )}
                </div>

                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    value={form.data.name}
                    onChange={(e) => updateFormData(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`status-${index}`}
                        value="ongoing"
                        checked={form.data.status === 'ongoing'}
                        onChange={(e) => updateFormData(index, 'status', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Ongoing</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`status-${index}`}
                        value="completed"
                        checked={form.data.status === 'completed'}
                        onChange={(e) => updateFormData(index, 'status', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">Completed</span>
                    </label>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Photo/Thumbnail *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoChange(index, file);
                    }}
                    className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  {form.photoPreview && (
                    <div className="mt-4">
                      <img
                        src={form.photoPreview}
                        alt={`Project ${index + 1} preview`}
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <p className="text-sm text-gray-500 mt-2">Preview</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={form.data.description}
                    onChange={(e) => updateFormData(index, 'description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe the project, its goals, technologies used, and outcomes..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Provide detailed information about the project
                  </p>
                </div>
              </div>
            ))}

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Adding...' : `Add ${forms.length} Project${forms.length > 1 ? 's' : ''}`}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/projects')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}