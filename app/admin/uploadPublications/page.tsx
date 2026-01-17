'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';

type ProjectFormData = {
  title: string;
  author: string;
  type: string;
  year: string;
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
  
  // Array of forms
  const [forms, setForms] = useState<ProjectFormData[]>([{
    title: '',
    author:'',
    type: '',
    year: '',
  }]);

  const addNewForm = () => {
    setForms([
      ...forms,
      {
        title: '',
        author:'',
        type: '',
        year: '',
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
      [field]: value,
    };
    setForms(updatedForms);
  };

  const validateForms = () => {
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < forms.length; i++) {
      const form = forms[i];
      
      if (!form.title.trim()) {
        return `Please enter title for project ${i + 1}`;
      }
      
      if (!form.type) {
        return `Please select type for project ${i + 1}`;
      }
      
      if (!form.year) {
        return `Please select year for project ${i + 1}`;
      }
      
      const yearNum = parseInt(form.year);
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        return `Please enter a valid year (1900-${currentYear + 1}) for project ${i + 1}`;
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
      console.log('Submitting forms:', forms);
      // Submit to API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projects: forms }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add projects');
      }

      setSuccess(true);
      
      // Reset form
      setForms([{
        title: '',
        author:'',
        type: '',
        year: '',
      }]);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/'); // Change this to your projects page route
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1900 + 2 }, // +2 to include current year + next year
    (_, i) => (currentYear + 1 - i).toString()
  );

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
                Add Publications
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

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => updateFormData(index, 'title', e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter project title"
                    required
                  />
                </div>
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => updateFormData(index, 'author', e.target.value)}
                    className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Authors, separated by commas"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => updateFormData(index, 'type', e.target.value)}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>
                      Select project type
                    </option>
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="book-chapter">Book Chapter</option>
                    <option value="patent">Patent</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) => updateFormData(index, 'year', e.target.value)}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>
                      Select year
                    </option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
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
                onClick={() => router.push('/')} // Change this to your projects page route
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