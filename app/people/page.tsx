// app/people/page.tsx
import Navbar from '@/components/Navbar';

export default function People() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Our People</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-4">
            Meet our talented team of researchers and faculty members.
          </p>
          {/* Add your team members content here */}
        </div>
      </div>
    </main>
  );
}