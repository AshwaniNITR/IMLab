// components/AboutUs.tsx
export default function AboutUs() {
  return (
    <div className="bg-gray-300 text-orange-500 p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-3">
        About Us
      </h2>
      <div className="space-y-4 text-gray-800">
        <p>
          The Integrated System Design Lab focuses on cutting-edge research in 
          hardware design, artificial intelligence acceleration, and advanced 
          computing systems.
        </p>
        <p>
          Our team works on developing innovative solutions for next-generation 
          computing architectures, with particular emphasis on energy-efficient 
          AI hardware, approximate computing, and semiconductor design.
        </p>
        <p>
          We collaborate with leading industry partners and academic institutions 
          to push the boundaries of what's possible in integrated systems and 
          microelectronics.
        </p>
      </div>
    </div>
  );
}