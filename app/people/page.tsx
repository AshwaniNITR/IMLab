'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TeamMemberCard from '@/components/TeamCard';

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

type MemberCategory = 'phd' | 'mtech' | 'btech';
type MemberStatus = 'past' | 'present';

interface CategorizedMembers {
  category: string;
  members: TeamMember[];
}

export default function People() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [categorizedMembers, setCategorizedMembers] = useState<CategorizedMembers[]>([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    if (teamMembers.length > 0) {
      categorizeMembers();
    }
  }, [teamMembers]);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/team-members');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch team members');
      }
      
      setTeamMembers(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Error fetching team members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const categorizeMembers = () => {
    // Create all categories in the specified order
    const categories: CategorizedMembers[] = [
      {
        category: 'Present Ph.D',
        members: filterMembers('phd', 'present')
      },
      {
        category: 'Present M.Tech',
        members: filterMembers('mtech', 'present')
      },
      {
        category: 'Present B.Tech',
        members: filterMembers('btech', 'present')
      },
      {
        category: 'Past Ph.D',
        members: filterMembers('phd', 'past')
      },
      {
        category: 'Past M.Tech',
        members: filterMembers('mtech', 'past')
      },
      {
        category: 'Past B.Tech',
        members: filterMembers('btech', 'past')
      }
    ];

    // Remove empty categories
    const nonEmptyCategories = categories.filter(category => category.members.length > 0);
    setCategorizedMembers(nonEmptyCategories);
  };

  const filterMembers = (category: MemberCategory, status: MemberStatus): TeamMember[] => {
    return teamMembers.filter(member => {
      const belongsToCategory = checkCategory(member.designation, category);
      if (!belongsToCategory) return false;
      
      const isPast = !!member.graduatedDate;
      return status === 'past' ? isPast : !isPast;
    });
  };

  const checkCategory = (designation: string, category: MemberCategory): boolean => {
    const lowerDesignation = designation.toLowerCase();
    
    switch (category) {
      case 'phd':
        return lowerDesignation.includes('phd') || 
               lowerDesignation.includes('ph.d') || 
               lowerDesignation.includes('doctor');
      case 'mtech':
        return lowerDesignation.includes('m.tech') || 
               lowerDesignation.includes('mtech') || 
               lowerDesignation.includes('master');
      case 'btech':
        return lowerDesignation.includes('b.tech') || 
               lowerDesignation.includes('btech') || 
               lowerDesignation.includes('bachelor');
      default:
        return false;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
  };

  const sortByEnrolledDate = (a: TeamMember, b: TeamMember) => {
    return new Date(b.enrolledDate).getTime() - new Date(a.enrolledDate).getTime();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Our People
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
          </div>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Meet our talented team of researchers, innovators, and visionaries at Integrated System Design Lab.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 border-t-orange-600 dark:border-orange-900 dark:border-t-orange-400"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-orange-600 dark:text-orange-400 font-semibold">Loading...</div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Fetching team members...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <div className={`rounded-xl border p-8 text-center ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold mb-2">Unable to Load Team Members</h3>
              <p className="mb-6">{error}</p>
              <button 
                onClick={fetchTeamMembers}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Team Members - Display All Categories in Specified Order */}
        {!isLoading && !error && teamMembers.length > 0 && categorizedMembers.length > 0 && (
          <div className="space-y-16">
            {categorizedMembers.map((category) => (
              <div key={category.category} className="space-y-8">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{category.category}</h3>
                    <div className={`h-1 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600`}></div>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    <span className="font-semibold">{category.members.length}</span> members
                  </div>
                </div>
                
                {/* Members List */}
                <div className="space-y-8">
                  {category.members.sort(sortByEnrolledDate).map((member, index) => (
                    <TeamMemberCard
                      key={member._id}
                      name={member.name}
                      image={member.imageUrl}
                      enrolledDate={formatDate(member.enrolledDate)}
                      graduatedDate={member.graduatedDate ? formatDate(member.graduatedDate) : undefined}
                      designation={member.designation}
                      description={member.description}
                      isDarkMode={isDarkMode}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && teamMembers.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">👥</div>
              <h3 className="text-2xl font-bold mb-4">No Team Members Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Team members will appear here once they're added to the database.
              </p>
              <button 
                onClick={fetchTeamMembers}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}