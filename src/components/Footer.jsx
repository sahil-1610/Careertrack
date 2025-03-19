import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-gray-900 dark:text-white text-lg font-medium">
              CareerTrack
            </h3>
            <p className="text-gray-400 dark:text-gray-400 text-sm">
              Empowering professionals to reach their full potential through
              AI-driven career guidance and development.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-900 dark:text-white text-sm font-medium uppercase tracking-wider">
              Features
            </h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link
                href="/resume-analyzer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Resume Analysis
              </Link>
              <Link
                href="/mock-interviews"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                AI Mock Interviews
              </Link>
              <Link
                href="/course-finder"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Course Recommendations
              </Link>
              <Link
                href="/job-board"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Job Portal
              </Link>
              <Link
                href="/career-mentor"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                AI Career Mentor
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-900 dark:text-white text-sm font-medium uppercase tracking-wider">
              Company
            </h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link
                href="/about"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/careers"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Careers
              </Link>
              <Link
                href="/contact"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-gray-900 dark:text-white text-sm font-medium uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/careertrack"
                aria-label="Twitter"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
            <div className="pt-2">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Subscribe to our newsletter
              </p>
              <div className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-50 dark:bg-gray-800 flex-1 rounded-l-md px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="rounded-r-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} CareerTrack. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
