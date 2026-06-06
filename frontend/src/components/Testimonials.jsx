import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Lina",
    quote: "Great platform — I earn extra income easily!",
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: 2,
    name: "Mark",
    quote: "Fast payments and clear task descriptions.",
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 3,
    name: "Priya",
    quote: "Supportive buyers and fair reviews.",
    avatar: "https://i.pravatar.cc/150?img=23",
  },
];

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-2xl font-bold mb-6">What Our Users Say</h3>
        <div className="card p-6">
          <img
            src={testimonials[idx].avatar}
            alt={testimonials[idx].name}
            className="mx-auto h-16 w-16 rounded-full mb-4"
          />
          <div className="font-semibold">{testimonials[idx].name}</div>
          <p className="text-gray-600 mt-2">"{testimonials[idx].quote}"</p>
          <div className="mt-4 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-3 h-3 rounded-full ${i === idx ? "bg-primary-600" : "bg-gray-300"}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
