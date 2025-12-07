// components/News.tsx

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Lab Wins Research Grant for Advanced Computing",
    description: "New grant to advance AI hardware through innovative architectures",
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Professor Receives Technical Excellence Award",
    description: "Recognition for pioneering contributions to AI hardware",
    date: "5 days ago",
  },
  {
    id: 3,
    title: "New Collaboration with Industry Partner",
    description: "Strategic partnership to advance semiconductor research",
    date: "1 week ago",
  },
//   {
//     id: 4,
//     title: "New Collaboration with Industry Partner",
//     description: "Strategic partnership to advance semiconductor research",
//     date: "1 week ago",
//   },
];

export default function News() {
  return (
    <div className="bg-[#666] rounded-2xl shadow-xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-3">
        News
      </h2>

      <div
        className="space-y-4 max-h-[400px] overflow-y-auto scroll-smooth pr-2
        scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700"
      >
        {newsItems.map((item) => (
          <div
            key={item.id}
            className="border-l-4 border-orange-500 pl-4 py-2 hover:bg-gray-700 transition-colors rounded cursor-pointer"
          >
            <h3 className="text-lg font-semibold text-orange-400 mb-1">
              {item.title}
            </h3>

            <p className="text-gray-300 text-sm mb-2">
              {item.description}
            </p>

            <p className="text-xs text-gray-400">
              {item.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
