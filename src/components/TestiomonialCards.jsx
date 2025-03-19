"use client";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const CareerTrackTestimonials = [
  {
    quote:
      "The career development program helped me transition smoothly into my new role. The personalized coaching and resume workshops were invaluable!",
    name: "Alex Johnson",
    title: "Software Engineer",
  },
  {
    quote:
      "The job placement services connected me with opportunities that matched my skills and career goals perfectly. The support was outstanding!",
    name: "Samantha Lee",
    title: "Data Analyst",
  },
  {
    quote:
      "The mentorship I received through this program gave me the confidence to pursue leadership roles. I am now thriving in a management position.",
    name: "Michael Chen",
    title: "Project Manager",
  },
  {
    quote:
      "Thanks to the career tracker’s networking events and workshops, I landed my dream job. The connections and insights provided were top-notch.",
    name: "Emily Taylor",
    title: "UI/UX Designer",
  },
  {
    quote:
      "The skill enhancement courses were a game-changer for my career. I learned new tools and techniques that have greatly boosted my job performance.",
    name: "Chris Morales",
    title: "Marketing Specialist",
  },
];

function Testimonials() {
  return (
    <div className="h-[30rem] w-full relative flex flex-col items-center justify-center overflow-hidden bg-slate-600">
      <div className="text-center max-w-3xl mx-auto mb-10 px-4">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
          Success Stories
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in animate-delay-100">
          See How CareerCraft Has{" "}
          <span className="text-gradient">Transformed Careers</span>
        </h2>
        <p className="text-muted-foreground animate-fade-in animate-delay-200">
          Discover how professionals like you have accelerated their career
          growth using our platform.
        </p>
      </div>
      <div className="flex justify-center w-full overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl">
          <InfiniteMovingCards
            items={CareerTrackTestimonials}
            direction="right"
            speed="slow"
          />
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
