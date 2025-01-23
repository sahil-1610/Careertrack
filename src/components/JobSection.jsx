"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "./hooks/use-outside-click";
// import { useInView } from "react-intersection-observer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function JobSection() {
  const [jobs, setJobs] = useState([]);
  const [active, setActive] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("20");
  const [totalPages, setTotalPages] = useState(50);
  const ref = useRef(null);
  const id = useId();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `/api/jobs?page=${page}&per_page=${perPage}`
        );
        const data = await response.json();
        setJobs(data.data);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      }
    };

    fetchJobs();
  }, [page, perPage]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handlePageChange = (newPage, number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={page === i ? "secondary" : "ghost"}
          className={`w-10 h-10 p-0 ${
            page === i
              ? "bg-neutral-100 text-neutral-900"
              : "text-blue-600 hover:text-blue-700"
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className="pt-32">
      {/* Header remains the same */}
      <div className="w-[calc(100%-4rem)] mx-auto rounded-md mb-20 overflow-hidden">
        <div className="text-center space-y-10">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
            Job Opportunities
          </h1>
        </div>
      </div>

      {/* Modal and Job List components */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.job_title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.job_title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.job_title}-${id}`}>
                <Image
                  priority
                  width={500}
                  height={500}
                  src={"/hiring.jpg"}
                  alt={active.job_title}
                  className="w-full h-48 sm:rounded-tr-lg md:rounded-tl-lg object-fill"
                />
              </motion.div>

              {/* Header section */}
              <div className="flex justify-between items-start p-4 border-b">
                <div className="">
                  <motion.h3
                    layoutId={`title-${active.job_title}-${id}`}
                    className="font-bold text-neutral-700 dark:text-neutral-200"
                  >
                    {active.job_title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${active.employer_name}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400"
                  >
                    {active.employer_name}
                  </motion.p>
                </div>
                <motion.a
                  layoutId={`button-${active.job_title}-${id}`}
                  href={active.job_apply_link}
                  target="_blank"
                  className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                  rel="noreferrer"
                >
                  Apply Here
                </motion.a>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                <div className="space-y-6 pb-6">
                  <div>
                    <motion.h4 className="font-bold text-lg mb-3">
                      Job Description
                    </motion.h4>
                    <p>
                      {active.job_description ||
                        "Details available on apply link"}
                    </p>
                  </div>

                  <div>
                    <motion.h4 className="font-bold text-lg mb-3">
                      Location
                    </motion.h4>
                    <p>
                      {active.job_location || "Details available on apply link"}
                    </p>
                  </div>

                  <div>
                    <motion.h4 className="font-bold text-lg mb-3">
                      Employment Type
                    </motion.h4>
                    <p>
                      {active.job_employment_type ||
                        "Details available on apply link"}
                    </p>
                  </div>

                  <div>
                    <motion.h4 className="font-bold text-lg mb-3">
                      Salary
                    </motion.h4>
                    <p>
                      {active.job_salary || "Details available on apply link"}
                    </p>
                  </div>

                  <div>
                    <motion.h4 className="font-bold text-lg mb-3">
                      Company Website
                    </motion.h4>
                    {active.employer_website ? (
                      <a
                        href={active.employer_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {active.employer_website}
                      </a>
                    ) : (
                      <p>Details available on apply link</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto w-full">
        <ul className="gap-4">
          {jobs.map((job, index) => (
            <motion.div
              layoutId={`card-${job.job_title}-${id}`}
              key={`card-${job.job_title}-${index}`}
              onClick={() => setActive(job)}
              className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
            >
              <div className="flex gap-4 flex-col md:flex-row items-center">
                <motion.div layoutId={`image-${job.job_title}-${id}`}>
                  <Image
                    width={100}
                    height={100}
                    src={job.employer_logo || "/jobs.jpg"}
                    alt={job.job_title}
                    className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                  />
                </motion.div>
                <div className="text-center md:text-left">
                  <motion.h3
                    layoutId={`title-${job.job_title}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    {job.job_title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${job.employer_name}-${id}`}
                    className="text-neutral-600 dark:text-neutral-400"
                  >
                    {job.employer_name}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          ))}
        </ul>

        <div className="mt-8 flex items-center justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Select
              value={perPage}
              onValueChange={(value) => {
                setPerPage(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-neutral-600">per page</span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="w-10 h-10 p-0"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {page > 3 && (
              <>
                <Button
                  variant="ghost"
                  className="w-10 h-10 p-0 text-blue-600 hover:text-blue-700"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </Button>
                {page > 4 && <span className="text-neutral-400 mx-1">...</span>}
              </>
            )}

            {renderPaginationNumbers()}

            {page < totalPages - 2 && (
              <>
                {page < totalPages - 3 && (
                  <span className="text-neutral-400 mx-1">...</span>
                )}
                <Button
                  variant="ghost"
                  className="w-10 h-10 p-0 text-blue-600 hover:text-blue-700"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              className="w-10 h-10 p-0"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* <div ref={bottomRef} className="h-10 w-full" /> */}
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
