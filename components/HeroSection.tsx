// components/HeroSection.tsx
interface HeroSectionProps {
  isDarkMode: boolean;
}

export default function HeroSection({ isDarkMode }: HeroSectionProps) {
  return (
    <div className={`w-full h-auto relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Image */}
      <div className="w-full h-[450px] md:h-[550px] overflow-hidden">
        <img
          src="/Image/Dp.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contact Section */}
      <div className={`p-6 text-center transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-600'
      }`}>
        <h1 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-orange-400' : 'text-gray-800'
        }`}>
          Sougata Kumar Kar
        </h1>
        <h2 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
          isDarkMode ? 'text-orange-300' : 'text-gray-700'
        }`}>
          Contact Us
        </h2>

        <p className={`mb-4 transition-colors duration-300 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Reach out for collaborations, research inquiries, or project opportunities.
        </p>

        <a
          href="mailto:example@gmail.com"
          className={`inline-block px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${
            isDarkMode 
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
}