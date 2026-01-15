// app/page.tsx
'use client';
import { useState } from 'react';
import Navbar from '@/app/admin/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import News from '@/components/News';
import ResearchScope from '@/components/ResearchScope';
import RecentPublications from '@/components/RecentPublications';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>
      Welcome to Admin Portal
      
    </main>
  );
}