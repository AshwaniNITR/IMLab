// components/ContactUs.tsx
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="bg-gray-300 rounded-2xl shadow-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        Contact Us
      </h2>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Address</p>
            <p className="text-gray-600 text-sm">Integrated System Design Lab</p>
            <p className="text-gray-600 text-sm">Department of Computer Science</p>
            <p className="text-gray-600 text-sm">University Campus, Building A</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Mail className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Email</p>
            <p className="text-gray-600 text-sm">isdl@university.edu</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-gray-800 font-medium">Phone</p>
            <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}