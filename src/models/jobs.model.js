import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    job_title: { type: String, required: true },
    employer_name: { type: String, required: true },
    employer_logo: { type: String },
    job_location: { type: String },
    job_employment_type: { type: String },
    job_posted_at: { type: Date, default: Date.now },
    job_is_remote: { type: Boolean, default: false },
    job_description: { type: String },
    job_apply_link: {
      type: String,
      required: true,
      unique: true,
    },
    employer_website: { type: String },
    job_publisher: { type: String },
    job_salary: { type: String },
    source_query: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
