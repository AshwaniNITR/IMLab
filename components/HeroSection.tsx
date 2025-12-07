export default function HeroSection() {
  return (
    <div className="w-full h-auto relative bg-white rounded-2xl overflow-hidden shadow-2xl">

      {/* Image */}
      <div className="w-full h-[450px] md:h-[550px] overflow-hidden">
        <img
          src="/Image/Dp.jpg"           
          alt="Hero"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contact Section */}
      <div className="p-6 bg-gray-200 text-gray-600 text-center">
        <h1 className="text-2xl font-semibold mb-2">Sougata Kumar Kar</h1>
        <h2 className="text-2xl font-semibold mb-2">Contact Us</h2>

        <p className="opacity-90 mb-4">
          Reach out for collaborations, research inquiries, or project opportunities.
        </p>

        <a
          href="mailto:example@gmail.com"     // <-- Replace with your email
          className="inline-block px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 transition shadow-lg"
        >
          Get in Touch
        </a>
      </div>

    </div>
  );
}
