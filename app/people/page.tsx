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

export default function People() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
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
          <div className="mb-8">
            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our People
            </h1>
            <p className={`text-lg transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Meet our talented team of researchers and faculty members.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
              {error}
            </div>
          )}

          {/* Team Members */}
          {!isLoading && !error && (
            <div className="space-y-8">
              {teamMembers.length === 0 ? (
                <p className={`text-center py-12 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No team members found.
                </p>
              ) : (
                teamMembers.map((member, index) => (
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
                ))
              )}
            </div>
          )}
        </div>
        
        <Footer />
      </div>
    </main>
  );
}