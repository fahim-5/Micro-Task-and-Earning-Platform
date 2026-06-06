import { useState, useEffect } from "react";

export default function HeroSlider() {
  const slides = [
    {
      title: "Earn by Completing Micro-Tasks",
      subtitle: "Quick tasks, instant coins, secure payouts.",
    },
    {
      title: "Create Tasks as a Buyer",
      subtitle: "Post tasks, set rewards, and review submissions.",
    },
    {
      title: "Join the Community",
      subtitle: "Workers, Buyers and Admins collaborate smoothly.",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative">
      <div className="h-80 md:h-96 flex items-center justify-center text-center bg-gradient-to-r from-primary-50 to-white">
        <div className="max-w-3xl px-6">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 animate-fade-up">
            {slides[index].title}
          </h2>
          <p className="text-lg text-gray-600 animate-fade-up animate-delay-200">
            {slides[index].subtitle}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-primary-600" : "bg-gray-300"}`}
                aria-label={`Go to slide ${i + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
