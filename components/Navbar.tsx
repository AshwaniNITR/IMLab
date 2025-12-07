// components/Navbar.tsx
'use client';
import Link from 'next/link';
import { Sun, Moon,GraduationCap } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  return (
    <nav className="bg-gray-800 text-white shadow-lg">
        <header className="bg-white border-b border-neutral-200">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-neutral-800 flex items-center justify-center rounded">
                    <GraduationCap className="w-10 h-10 text-amber-600" />
                    </div>
                    <div className="border-l-2 border-neutral-300 pl-4">
                    <h1 className="text-2xl font-bold text-orange-500 tracking-tight">
                        Integrated System Design Lab
                    </h1>
                    </div>
                </div>
                </div>
            </div>
        </header>
      <div className="container mx-auto px-4">
        
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 pb-0">
            <Link 
              href="/" 
              className="px-6 py-3 hover:text-orange-500 hover:bg-gray-800 transition-colors border-b-2 border-white font-semibold"
            >
              Home
            </Link>
            <Link 
              href="/people" 
              className="px-6 py-3 hover:text-orange-500 hover:bg-gray-800 transition-colors text-gray-300 "
            >
              People
            </Link>
            <Link 
              href="/research" 
              className="px-6 py-3 hover:text-orange-500 hover:bg-gray-800 transition-colors text-gray-300"
            >
              Research
            </Link>
            <Link 
              href="/publications" 
              className="px-6 py-3 hover:text-orange-500 hover:bg-gray-800 transition-colors text-gray-300"
            >
              Publication
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 hover:text-orange-500 hover:bg-gray-800 transition-colors text-gray-300"
            >
              Contact
            </Link>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex items-center space-x-2 mr-4"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-5 h-5" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-5 h-5" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}