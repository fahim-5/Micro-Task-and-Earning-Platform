const workers = [
  {
    id: 1,
    name: "Aisha Khan",
    coins: 1240,
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Omar Ali",
    coins: 1120,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 3,
    name: "Sara Ahmed",
    coins: 980,
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 4,
    name: "Rahul Das",
    coins: 870,
    avatar: "https://i.pravatar.cc/150?img=14",
  },
  {
    id: 5,
    name: "Mina Park",
    coins: 760,
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 6,
    name: "John Doe",
    coins: 690,
    avatar: "https://i.pravatar.cc/150?img=16",
  },
];

export default function BestWorkers() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold mb-6">Best Workers</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {workers.map((w) => (
            <div key={w.id} className="card p-4 text-center">
              <img
                src={w.avatar}
                alt={w.name}
                className="mx-auto h-16 w-16 rounded-full mb-3"
              />
              <div className="text-sm font-medium">{w.name}</div>
              <div className="text-xs text-gray-500">
                Coins: <span className="font-semibold">{w.coins}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
