// components/Stats.tsx
export default function Stats() {
  const stats = [
    { label: 'Research Areas', value: '5+' },
    { label: 'Publications', value: '50+' },
    { label: 'Team Members', value: '20+' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-gray-700 rounded-xl p-6 text-center text-white hover:bg-gray-600 transition-colors"
        >
          <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
          <div className="text-4xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}