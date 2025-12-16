// app/page.tsx
'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import News from '@/components/News';
import ResearchScope from '@/components/ResearchScope';
import Footer from '@/components/Footer';
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

      <div className="pt-32">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <HeroSection isDarkMode={isDarkMode} />
            </div>

            <div className="space-y-4">
              <AboutUs isDarkMode={isDarkMode} />
              <News isDarkMode={isDarkMode} />
            </div>
          </div>

          <ResearchScope isDarkMode={isDarkMode} />
          <div className="mt-12">
             <RecentPublications isDarkMode={isDarkMode} />
          </div>
        </div>
         

        <Footer />
      </div>
    </main>
  );
}