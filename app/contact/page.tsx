// app/contact/page.tsx
import Navbar from '@/components/Navbar';

export default function Contact() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-4">
            Get in touch with our team.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p className="text-gray-600">Integrated System Design Lab</p>
              <p className="text-gray-600">Your University</p>
              <p className="text-gray-600">City, State, ZIP</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-gray-600">lab@university.edu</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}