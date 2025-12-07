import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 mt-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Column 1 */}
        <div className="space-y-2">
          <h3 className="text-orange-300 font-semibold mb-3">Resources</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:underline cursor-pointer">OneCampus Portal</li>
            <li className="hover:underline cursor-pointer">Brightspace</li>
            <li className="hover:underline cursor-pointer">Campus News</li>
            <li className="hover:underline cursor-pointer">Information Technology</li>
            <li className="hover:underline cursor-pointer">Outlook</li>
            <li className="hover:underline cursor-pointer">Directory</li>
          </ul>
        </div>

        {/* Column 2 */}
        <div className="space-y-2">
          <h3 className="text-orange-300 font-semibold mb-3">Campus</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:underline cursor-pointer">Faculty & Staff</li>
            <li className="hover:underline cursor-pointer">Campus Map</li>
            <li className="hover:underline cursor-pointer">Public Safety</li>
            <li className="hover:underline cursor-pointer">Construction Updates</li>
            <li className="hover:underline cursor-pointer">Physical Facilities</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="space-y-2">
          <h3 className="text-orange-300 font-semibold mb-3">Academics</h3>
          <ul className="space-y-1 text-sm">
            <li className="hover:underline cursor-pointer">Schools & Programs</li>
            <li className="hover:underline cursor-pointer">Research Centers</li>
            <li className="hover:underline cursor-pointer">Industry Collaborations</li>
            <li className="hover:underline cursor-pointer">Student Services</li>
            <li className="hover:underline cursor-pointer">Engineering Network</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="space-y-3">
          <h3 className="text-orange-300 font-semibold mb-3">Connect With Us</h3>

          <div className="flex space-x-4 text-xl">
            <a className="hover:text-orange-300 cursor-pointer">
              <Facebook size={22} />
            </a>
            <a className="hover:text-orange-300 cursor-pointer">
              <Twitter size={22} />
            </a>
            <a className="hover:text-orange-300 cursor-pointer">
              <Instagram size={22} />
            </a>
            <a className="hover:text-orange-300 cursor-pointer">
              <Youtube size={22} />
            </a>
          </div>

          <p className="text-sm text-gray-400 leading-6">
            123 Research Lane, NIT Rourkela  
            <br />
            contact@example.com
          </p>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} NIT Rourkela — All Rights Reserved
      </div>
    </footer>
  );
}
