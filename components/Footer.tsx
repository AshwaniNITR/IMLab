import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const footerData = [
    {
      title: "Quick Links",
      links: [
        "OneCampus Portal",
        "Brightspace",
        "Campus News",
        "Information Technology",
      ]
    },
    {
      title: "Academics & Research",
      links: [
        "Schools & Programs",
        "Research Centers",
        "Industry Collaborations",
        "Physical Facilities"
      ]
    },
    {
      title: "Connect With Us",
      isContact: true
    }
  ];

  const socialMedia = [
    { Icon: Facebook, label: "Facebook" },
    { Icon: Twitter, label: "Twitter" },
    { Icon: Instagram, label: "Instagram" },
    { Icon: Youtube, label: "Youtube" }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 mt-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-6">
          
          {footerData.map((column, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-orange-400 font-bold text-lg mb-6 relative inline-block">
                {column.title}
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-orange-400 -mb-2"></span>
              </h3>
              
              {column.isContact ? (
                <div className="space-y-6">
                  <div className="flex space-x-5">
                    {socialMedia.map(({ Icon, label }) => (
                      <a
                        key={label}
                        className="bg-gray-700 hover:bg-orange-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110 cursor-pointer"
                        aria-label={label}
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start space-x-3 hover:text-orange-300 transition-colors">
                      <MapPin size={18} className="mt-1 flex-shrink-0 text-orange-400" />
                      <span className="leading-relaxed">
                        Department of Electronics and Communication<br />
                        NIT Rourkela, Odisha 769008
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors cursor-pointer">
                      <Mail size={18} className="flex-shrink-0 text-orange-400" />
                      <span>contact@nitrourkela.ac.in</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 hover:text-orange-300 transition-colors cursor-pointer">
                      <Phone size={18} className="flex-shrink-0 text-orange-400" />
                      <span>+91 661 246 2000</span>
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {column.links!.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className="text-sm hover:text-orange-300 hover:translate-x-2 transition-all duration-200 cursor-pointer"
                    >
                      <span className="inline-block">{link}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          
        </div>

        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} National Institute of Technology Rourkela. All Rights Reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a className="hover:text-orange-300 cursor-pointer transition-colors">Privacy Policy</a>
              <span>|</span>
              <a className="hover:text-orange-300 cursor-pointer transition-colors">Terms of Service</a>
              <span>|</span>
              <a className="hover:text-orange-300 cursor-pointer transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}