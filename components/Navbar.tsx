// components/Navbar.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon, GraduationCap, Menu, X } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/people', label: 'People' },
    { href: '/research', label: 'Research' },
    { href: '/publication', label: 'Publication' },
    { href: '/contact', label: 'Contact' }
  ];

  return (
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
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded flex-shrink-0 transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-orange-600 shadow-lg shadow-orange-500/50'
                    : 'bg-neutral-800'
                }`}
              >
                <GraduationCap
                  className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-amber-600'
                  }`}
                />
              </div>

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
  );
}
