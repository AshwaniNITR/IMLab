// components/ResearchScope.tsx
interface ScopeItem {
  id: number;
  title: string;
  description: string;
  img: string;
}

interface ResearchScopeProps {
  isDarkMode: boolean;
}

const scopeData: ScopeItem[] = [
  {
    id: 1,
    title: "Analog IC Design",
    description: "Optimizing neural network performance through custom ASIC and FPGA designs.",
    img: "/images/ai-hardware.jpg",
  },
  {
    id: 2,
    title: "Sensor Interfacing Circuits",
    description: "Advancing semiconductor architecture for high performance and efficiency.",
    img: "/images/vlsi.jpg",
  },
  {
    id: 3,
    title: "Low Power Bio-medical Circuits",
    description: "Rapid prototyping and real-time validation of hardware designs.",
    img: "/images/fpga.jpg",
  },
  {
    id: 4,
    title: "Embedded System Design",
    description: "Developing energy-efficient embedded architectures and IoT devices.",
    img: "/images/embedded.jpg",
  },
  {
    id: 5,
    title: "Measurement and Instrumentation",
    description: "Architectures for parallel computing, GPU/TPU-based acceleration.",
    img: "/images/hpc.jpg",
  },
];

export default function ResearchScope({ isDarkMode }: ResearchScopeProps) {
  return (
    <div className={`rounded-2xl shadow-xl p-8 transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-[#666]'
    }`}>
      <h2 className={`text-3xl font-bold mb-8 pb-4 transition-colors duration-300 ${
        isDarkMode 
          ? 'border-b border-gray-700 text-white' 
          : 'border-b border-gray-600 text-white'
      }`}>
        Research Scope
      </h2>

      {/* Updated grid container with responsive centering */}
      <div className="flex flex-wrap justify-center gap-6 ">
        {scopeData.map((item) => (
          <div
            key={item.id}
            className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-sm ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-orange-400' : 'text-gray-900'
              }`}>
                {item.title}
              </h3>

              <p className={`text-sm mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.description}
              </p>

              <button className={`px-4 py-2 rounded-lg transition-all duration-300 w-full ${
                isDarkMode 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}>
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}