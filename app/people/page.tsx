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
    const categories: CategorizedMembers[] = [
      {
        category: 'Present Ph.D',
        members: filterMembers('phd', 'present')
      },
      {
        category: 'Past Ph.D',
        members: filterMembers('phd', 'past')
      },
      {
        category: 'Present M.Tech',
        members: filterMembers('mtech', 'present')
      },
      {
        category: 'Past M.Tech',
        members: filterMembers('mtech', 'past')
      },
      {
        category: 'Present B.Tech',
        members: filterMembers('btech', 'present')
      },
      {
        category: 'Past B.Tech',
        members: filterMembers('btech', 'past')
      }
    ];

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our People</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Meet our talented team of researchers and faculty members.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded max-w-md mx-auto">
              <p>{error}</p>
              <button 
                onClick={fetchTeamMembers}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Team Members - Categorized */}
        {!isLoading && !error && (
          <div className="space-y-16">
            {categorizedMembers.length === 0 && teamMembers.length > 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No team members found in predefined categories.
                </p>
                {/* Fallback: Show all members if no categories match */}
                <div className="mt-8">
                  <h2 className="text-2xl font-bold mb-6">All Team Members</h2>
                  <div className="space-y-8">
                    {teamMembers.sort(sortByEnrolledDate).map((member, index) => (
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
              </div>
            ) : (
              categorizedMembers.map((category) => (
                <div key={category.category} className="mb-12">
                  <h2 className="text-3xl font-bold mb-2 border-b pb-2 border-gray-200 dark:border-gray-700">
                    {category.category}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {category.members.length} {category.members.length === 1 ? 'member' : 'members'}
                  </p>
                  
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
              ))
            )}
          </div>
        )}

        {/* Show empty state if no members at all */}
        {!isLoading && !error && teamMembers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No team members found.
            </p>
          </div>
        )}
      </main>
      
      <Footer  />
    </div>
  );
}