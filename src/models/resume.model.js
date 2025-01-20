import mongoose from "mongoose";

const resumeFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
    index: true,
  },
  resumeVersion: {
    type: Number,
    default: 1,
  },
  resumeTitle: {
    type: String,
    default: "Resume Version 1",
  },
  improvementSuggestions: {
    type: [String],
    required: [true, "Improvement suggestions are required"],
  },
  missingSkills: {
    type: [String],
    required: [true, "Missing skills analysis is required"],
  },
  formattingFeedback: {
    type: [String],
    required: [true, "Formatting feedback is required"],
  },
  similarityScore: {
    type: Number,
    required: [true, "Similarity score is required"],
    min: [0, "Score cannot be less than 0"],
    max: [100, "Score cannot be more than 100"],
  },
  jobDescription: {
    type: String,
    required: [true, "Job description is required"],
  },
  resumeText: {
    type: String,
    required: [true, "Resume Text is required"],
  },
  status: {
    type: String,
    enum: ["pending", "reviewed", "archived"],
    default: "pending",
  },
  reviewDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
resumeFeedbackSchema.index({ user: 1, createdAt: -1 });

// Update the timestamp before saving
resumeFeedbackSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create a standalone model for ResumeFeedback
const ResumeFeedback =
  mongoose.models.ResumeFeedback ||
  mongoose.model("ResumeFeedback", resumeFeedbackSchema);

export default ResumeFeedback;
