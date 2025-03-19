import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CallToAction = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-slate-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="glass-effect rounded-2xl p-8 md:p-16 relative overflow-hidden animate-fade-in bg-slate-800/50">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 animate-glow"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-100">
                Ready to Elevate Your{" "}
                <span className="text-gradient">Career Journey</span>?
              </h2>
              <p className="text-muted-foreground text-lg">
                Join thousands of professionals who've transformed their careers
                with our AI-powered platform. Start your journey today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button className="w-full sm:w-auto rounded-full text-base font-medium px-8 py-6 bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
              {/* <Link href="/demo">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full text-base font-medium px-8 py-6 border-primary/50 text-primary hover:bg-primary/10"
                >
                  Request Demo
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
