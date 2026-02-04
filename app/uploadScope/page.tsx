'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';

type ProjectFormData = {
  imageUrlOne: string;
  title: string;
  brief: string;
  description: string;
  imageUrlTwo: string;
};

export default function AddProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Array of forms with image previews
  const [forms, setForms] = useState<{
    data: ProjectFormData;
    imageOnePreview: string | null;
    imageTwoPreview: string | null;
  }[]>([{
    data: {
      imageUrlOne: '',
      title: '',
      brief: '',
      description: '',
      imageUrlTwo: '',
    },
    imageOnePreview: null,
    imageTwoPreview: null,
  }]);

  const handleImageChange = (index: number, field: 'imageUrlOne' | 'imageUrlTwo', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedForms = [...forms];
      updatedForms[index] = {
        ...updatedForms[index],
        data: { ...updatedForms[index].data, [field]: reader.result as string },
        [`${field === 'imageUrlOne' ? 'imageOne' : 'imageTwo'}Preview`]: reader.result as string,
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
          imageUrlOne: '',
          title: '',
          brief: '',
          description: '',
          imageUrlTwo: '',
        },
        imageOnePreview: null,
        imageTwoPreview: null,
      },
    ]);
  };

  const removeForm = (index: number) => {
    if (forms.length === 1) {
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
      if (!form.imageUrlOne || !form.title || !form.brief || !form.description || !form.imageUrlTwo) {
        return `Please fill in all required fields for project ${i + 1}`;
      }
      if (form.brief.length > 2000) {
        return `Brief cannot exceed 2000 characters for project ${i + 1}`;
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

      // Submit to API
      const response = await fetch('/api/rscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projects: forms.map(form => form.data)
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add projects');
      }

      setSuccess(true);
      
      // Reset form
      setForms([{
        data: {
          imageUrlOne: '',
          title: '',
          brief: '',
          description: '',
          imageUrlTwo: '',
        },
        imageOnePreview: null,
        imageTwoPreview: null,
      }]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Add RScope Projects
              </h1>
              <p className="text-gray-600">
                Fill in the details to add new research scope projects
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

                {/* First Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Image URL *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={form.data.imageUrlOne}
                      onChange={(e) => updateFormData(index, 'imageUrlOne', e.target.value)}
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter first image URL"
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageChange(index, 'imageUrlOne', file);
                      }}
                      className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {form.imageOnePreview && (
                    <div className="mt-4">
                      <img
                        src={form.imageOnePreview}
                        alt={`Project ${index + 1} first image preview`}
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <p className="text-sm text-gray-500 mt-2">First Image Preview</p>
                    </div>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={form.data.title}
                    onChange={(e) => updateFormData(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                    required
                  />
                </div>

                {/* Brief */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Brief * (Max 2000 characters)
                  </label>
                  <textarea
                    value={form.data.brief}
                    onChange={(e) => updateFormData(index, 'brief', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter project brief"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {form.data.brief.length}/2000 characters
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={form.data.description}
                    onChange={(e) => updateFormData(index, 'description', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter detailed project description"
                    required
                  />
                </div>

                {/* Second Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Image URL *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={form.data.imageUrlTwo}
                      onChange={(e) => updateFormData(index, 'imageUrlTwo', e.target.value)}
                      className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter second image URL"
                      required
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageChange(index, 'imageUrlTwo', file);
                      }}
                      className="w-full px-4 text-black py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {form.imageTwoPreview && (
                    <div className="mt-4">
                      <img
                        src={form.imageTwoPreview}
                        alt={`Project ${index + 1} second image preview`}
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <p className="text-sm text-gray-500 mt-2">Second Image Preview</p>
                    </div>
                  )}
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
                onClick={() => router.push('/rscope')}
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