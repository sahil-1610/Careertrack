import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

function CareerPath() {
  const careers = [
    {
      title: "Software Engineer",
      description:
        "Design, develop, and maintain software applications with expertise in various programming languages and frameworks.",
    },
    {
      title: "Data Analyst",
      description:
        "Analyze complex datasets to extract valuable insights that drive business decisions and strategy.",
    },
    {
      title: "UI/UX Designer",
      description:
        "Create intuitive user interfaces and experiences that are both aesthetically pleasing and highly functional.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            Featured Careers
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-100 animate-fade-in animate-delay-100">
            <span className="text-gradient">Work With the Best</span> in Your
            Field
          </h2>
          <p className="text-slate-400 animate-fade-in animate-delay-200">
            Explore top career paths and discover what skills you need to
            succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careers.map((career, index) => (
            <div
              key={index}
              className="glass-effect rounded-2xl p-8 card-hover bg-slate-800/50 animate-slide-up"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <h3 className="text-xl font-semibold mb-4 text-slate-100">
                {career.title}
              </h3>
              <p className="text-slate-400 mb-6">{career.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in animate-delay-500">
          <Link
            href="/jobs"
            className="inline-flex items-center text-slate-100 hover:text-slate-300 transition-colors"
          >
            View All Career Paths <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CareerPath;
