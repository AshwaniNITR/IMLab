// app/publications/page.tsx
import Navbar from '@/components/Navbar';

export default function Publications() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Publications</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-4">
            Browse our latest research publications and papers.
          </p>
          {/* Add your publications list here */}
        </div>
      </div>
    </main>
  );
}