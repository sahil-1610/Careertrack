// models/interview.model.js
import mongoose from "mongoose";

const interviewQuestionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    jobTitle: {
      type: String,
      required: [true, "Please provide a job title"],
    },
    jobDescription: {
      type: String,
      required: [true, "Please provide a job description"],
    },
    jobExperience: {
      type: Number,
      required: [true, "Please provide required experience in years"],
    },
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        correctAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const InterviewQuestion =
  mongoose.models.InterviewQuestion ||
  mongoose.model("InterviewQuestion", interviewQuestionSchema);
export default InterviewQuestion;
