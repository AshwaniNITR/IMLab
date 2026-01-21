// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, GraduationCap, Menu, X } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface AdminLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLogoClick = () => {
    setIsAdminModalOpen(true);
    setError(''); // Clear any previous errors
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Send login request to API
      const response = await fetch('/api/checkAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data: AdminLoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        // Login successful
        console.log('Login successful:', data.user);
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('admin_token', data.token);
          // You might want to store user info as well
          localStorage.setItem('admin_user', JSON.stringify(data.user));
        }
        
        // Close modal and reset form
        setIsAdminModalOpen(false);
        setEmail('');
        setPassword('');
        
        // Optional: Redirect to admin page or show success message
        window.location.href = '/admin/dashboard';
        // alert('Login successful! Welcome to the admin panel.');
        
        // Optional: Trigger a custom event that other components can listen to
        // window.dispatchEvent(new CustomEvent('adminLogin', { 
        //   detail: { user: data.user } 
        // }));
        
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed. Please try again.');
      
      // Optional: Clear password on error
      setPassword('');
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsAdminModalOpen(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/people', label: 'People' },
    { href: '/research', label: 'Research' },
    { href: '/projects', label: 'Projects' },
    { href: '/publication', label: 'Publication' },
    {href:'/vacancy', label:'Vacancy'},
    { href: '#contactus', label: 'Contact' }
  ];

  return (
    <>
      <nav
        className={`shadow-lg transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'
        }`}
      >
        {/* Header Section */}
        <header
          className={`border-b transition-colors duration-300 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-neutral-200'
          }`}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleLogoClick}
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded flex-shrink-0 transition-all duration-300 cursor-pointer hover:opacity-90 active:scale-95 ${
                    isDarkMode
                      ? 'bg-orange-600 shadow-lg shadow-orange-500/50'
                      : 'bg-neutral-800'
                  }`}
                  aria-label="Admin Access"
                  title="Admin Access"
                >
                  <GraduationCap
                    className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-amber-600'
                    }`}
                  />
                </button>

                <div
                  className={`border-l-2 pl-3 sm:pl-4 transition-colors duration-300 ${
                    isDarkMode ? 'border-gray-600' : 'border-neutral-300'
                  }`}
                >
                  <h1
                    className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-colors duration-300 ${
                      isDarkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}
                  >
                    Integrated System Design Lab
                  </h1>
                  <h3
                    className={`text-sm sm:text-base font-semibold tracking-tight transition-colors duration-300 ${
                      isDarkMode ? 'text-orange-300' : 'text-orange-600'
                    }`}
                  >
                    NIT Rourkela
                  </h3>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className={`lg:hidden p-2 rounded-lg transition-colors duration-300 ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Section */}
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`px-6 py-3 transition-all duration-300 relative group ${
                      isActive
                        ? 'font-semibold text-orange-400'
                        : isDarkMode
                        ? 'text-gray-300 hover:text-orange-400'
                        : 'text-gray-200 hover:text-orange-400'
                    } ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-700'}`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-400 scale-x-100'
                          : 'bg-orange-400 scale-x-0 group-hover:scale-x-100'
                      }`}
                    ></span>
                  </a>
                );
              })}
            </div>

            {/* Theme Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className={`relative px-6 py-2.5 rounded-full transition-all duration-300 flex items-center space-x-2 font-medium overflow-hidden ${
                isDarkMode
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50'
                  : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-500/20 hover:shadow-gray-500/40'
              }`}
              aria-label="Toggle theme"
            >
              <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </div>
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? isDarkMode
                          ? 'bg-gray-800 text-orange-400 font-semibold shadow-md'
                          : 'bg-gray-700 text-orange-400 font-semibold shadow-md'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-orange-400'
                        : 'text-gray-200 hover:bg-gray-700 hover:text-orange-400'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              })}

              {/* Theme Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mt-4 font-medium ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-lg shadow-gray-500/20'
                }`}
                aria-label="Toggle theme"
              >
                <div className={`transition-all duration-500 ${isDarkMode ? 'rotate-180' : 'rotate-0'}`}>
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </div>
                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Admin Access Modal */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleModalClose}
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative transform overflow-hidden rounded-lg shadow-xl transition-all max-w-md w-full">
              {/* Modal Content */}
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
                {/* Modal Header */}
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                    Admin Access
                  </h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Enter your credentials to access admin features
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    isDarkMode 
                      ? 'bg-red-900/30 border border-red-700 text-red-300' 
                      : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleAdminLogin}>
                  <div className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <label 
                        htmlFor="email" 
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50'
                        }`}
                        placeholder="admin@example.com"
                      />
                    </div>

                    {/* Password Input */}
                    <div>
                      <label 
                        htmlFor="password" 
                        className={`block text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50'
                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 disabled:opacity-50'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={handleModalClose}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                          isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed ${
                          isLoading
                            ? 'bg-orange-400 opacity-70'
                            : `bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg ${
                                isDarkMode 
                                  ? 'shadow-orange-500/30 hover:shadow-orange-500/50' 
                                  : 'shadow-orange-500/20 hover:shadow-orange-500/40'
                              } hover:opacity-90`
                        }`}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Logging in...
                          </span>
                        ) : (
                          'Login'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}