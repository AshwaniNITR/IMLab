import { GraduationCap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-neutral-800 flex items-center justify-center rounded">
              <GraduationCap className="w-10 h-10 text-amber-600" />
            </div>
            <div className="border-l-2 border-neutral-300 pl-4">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
                Integrated System Design Lab
              </h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}