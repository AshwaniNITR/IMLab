// app/page.tsx
'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutUs from '@/components/AboutUs';
import News from '@/components/News';
import ResearchScope from '@/components/ResearchScope';
import Footer from '@/components/Footer';


export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <main
      className={`min-h-screen ${
        isDarkMode ? 'bg-gray-100 text-gray-900' : 'bg-gray-500 text-white'
      }`}
    >

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>


    <div className="pt-[80px]"> 
        <div className="container mx-auto px-4 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-12">
            
            
            <div className="space-y-4">
              <HeroSection />
            </div>

            
            <div className="space-y-4">
              <AboutUs />
              <News />
            </div>

          </div>

          {/* Research Scope Section */}
          <ResearchScope />
        </div>

        <Footer />
      </div>
    </main>
  );
}
