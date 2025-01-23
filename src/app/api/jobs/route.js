import { NextResponse } from "next/server";
import { connectDB } from "@/helpers/dbConfig";
import Job from "@/models/jobs.model";

const QUERIES = [
  "developer jobs in india",
  "software engineer jobs",
  "tech jobs remote",
  "full stack developer",
  "backend developer india",
];

const getJobSearchUrl = (query, page = 1, perPage = 20) =>
  `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
    query
  )}&page=${page}&num_pages=10&per_page=${perPage}`;

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
};

const processJobData = (job, sourceQuery) => ({
  id: job.job_id,
  job_title: job.job_title,
  employer_name: job.employer_name,
  employer_logo: job.employer_logo || "/placeholder.svg?height=100&width=100",
  job_location: job.job_city
    ? `${job.job_city}, ${job.job_state}, ${job.job_country}`
    : job.job_country,
  job_employment_type: job.job_employment_type || "Not specified",
  job_posted_at: new Date(job.job_posted_at_datetime_utc || Date.now()),
  job_is_remote: job.job_is_remote || false,
  job_description: job.job_description || "This is the description for the job",
  job_apply_link: job.job_apply_link,
  employer_website: job.employer_website || `https://example.com`,
  job_publisher: job.job_publisher || "Unknown",
  job_salary:
    job.job_min_salary && job.job_max_salary
      ? `$${job.job_min_salary} - $${job.job_max_salary}`
      : job.job_salary || "$50,000 - $100,000",
  source_query: sourceQuery,
});

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "20", 10);

  await connectDB();

  try {
    const currentQuery = QUERIES[(page - 1) % QUERIES.length];
    const url = getJobSearchUrl(currentQuery, page, perPage);

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.data) {
      const bulkOps = data.data.map((job) => ({
        updateOne: {
          filter: { job_apply_link: job.job_apply_link },
          update: { $set: processJobData(job, currentQuery) },
          upsert: true,
        },
      }));

      await Job.bulkWrite(bulkOps);
    }

    const jobs = await Job.find()
      .sort({ job_posted_at: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return NextResponse.json({
      message: "Jobs fetched successfully",
      data: jobs,
      totalJobs: await Job.countDocuments(),
      currentPage: page,
      totalPages: Math.ceil((await Job.countDocuments()) / perPage),
      currentQuery,
    });
  } catch (error) {
    console.error("Job fetch error:", error);
    return NextResponse.json(
      {
        error: "Error fetching jobs",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
