// components/RecentPublications.tsx
interface PublicationItem {
  id: number;
  title: string;
  authors: string;
  venue: string;
  year: number;
  link?: string;
  type: 'journal' | 'patent' | 'conference';
}

interface RecentPublicationsProps {
  isDarkMode: boolean;
}

const publicationData: PublicationItem[] = [
  // Journal Publications
  {
    id: 1,
    title: "Advanced Neural Network Acceleration Using Custom ASIC Designs",
    authors: "A. Sharma, R. Kumar, S. Patel",
    venue: "IEEE Transactions on Computer-Aided Design",
    year: 2024,
    type: 'journal'
  },
  {
    id: 2,
    title: "Energy-Efficient VLSI Architecture for Edge AI Applications",
    authors: "M. Chen, L. Wang, J. Kim",
    venue: "ACM Journal on Emerging Technologies",
    year: 2023,
    type: 'journal'
  },
  {
    id: 3,
    title: "Next-Generation Semiconductor Materials for High-Frequency Circuits",
    authors: "K. Tanaka, S. Rodriguez, P. Schmidt",
    venue: "Nature Electronics",
    year: 2024,
    type: 'journal'
  },
  
  // Patent Publications
  {
    id: 4,
    title: "System and Method for FPGA-Based Neural Network Acceleration",
    authors: "J. Davis, M. Roberts",
    venue: "US Patent 11,234,567",
    year: 2023,
    type: 'patent'
  },
  {
    id: 5,
    title: "Low-Power Embedded Architecture for IoT Devices",
    authors: "R. Gupta, S. Mishra",
    venue: "US Patent 11,345,678",
    year: 2024,
    type: 'patent'
  },
  {
    id: 6,
    title: "Parallel Computing Architecture for Real-Time Signal Processing",
    authors: "T. Nakamura, H. Lee",
    venue: "European Patent EP4567890",
    year: 2023,
    type: 'patent'
  },
  
  // Conference Papers
  {
    id: 7,
    title: "Real-Time FPGA Implementation of Deep Learning Algorithms",
    authors: "S. Zhang, W. Li, A. Kumar",
    venue: "IEEE International Conference on VLSI Design",
    year: 2024,
    type: 'conference'
  },
  {
    id: 8,
    title: "Robust Control Systems for Autonomous Navigation",
    authors: "E. Martinez, C. Park, D. Ivanov",
    venue: "ACM/IEEE Design Automation Conference",
    year: 2023,
    type: 'conference'
  },
  {
    id: 9,
    title: "High-Performance Computing Architectures for Biomedical Applications",
    authors: "L. Chen, M. Abdullah, S. O'Connor",
    venue: "International Symposium on Computer Architecture",
    year: 2024,
    type: 'conference'
  },
];

export default function RecentPublications({ isDarkMode }: RecentPublicationsProps) {
  // Filter publications by type
  const journalPublications = publicationData.filter(item => item.type === 'journal');
  const patentPublications = publicationData.filter(item => item.type === 'patent');
  const conferencePublications = publicationData.filter(item => item.type === 'conference');

  // Function to render publication section
  const renderPublicationSection = (
    title: string,
    publications: PublicationItem[],
    showReadMore: boolean = true
  ) => {
    return (
      <div className="mb-10">
        <h3 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {title}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {publications.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className={`rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-50'
              }`}
            >
              <div className={`text-xs font-semibold mb-3 px-3 py-1 rounded-full inline-block ${
                item.type === 'journal' 
                  ? 'bg-blue-500 text-white' 
                  : item.type === 'patent'
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 text-white'
              }`}>
                {item.type.toUpperCase()}
              </div>
              
              <h4 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {item.title}
              </h4>
              
              <p className={`text-sm mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span className="font-semibold">Authors:</span> {item.authors}
              </p>
              
              <p className={`text-sm mb-3 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span className="font-semibold">Published in:</span> {item.venue}
              </p>
              
              <div className="flex justify-between items-center">
                <span className={`text-sm transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Year: {item.year}
                </span>
                
                <button className={`text-sm font-medium transition-colors duration-300 ${
                  isDarkMode 
                    ? 'text-orange-400 hover:text-orange-300' 
                    : 'text-orange-600 hover:text-orange-500'
                }`}>
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {showReadMore && (
          <div className="text-center">
            <button className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}>
              Read More {title}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-2xl shadow-xl p-8 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-[#666]'
    }`}>
      <h2 className={`text-3xl font-bold mb-8 pb-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'border-b border-gray-700 text-white' 
          : 'border-b border-gray-600 text-white'
      }`}>
        Recent Publications
      </h2>

      <div className="space-y-10">
        {renderPublicationSection("Journal Publications", journalPublications)}
        {renderPublicationSection("Patent Publications", patentPublications)}
        {renderPublicationSection("Conference Papers", conferencePublications)}
      </div>
    </div>
  );
}