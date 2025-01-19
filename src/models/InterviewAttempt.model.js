// models/interviewAttempt.model.js
import mongoose from "mongoose";

const interviewAttemptSchema = new mongoose.Schema(
  {
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewQuestion",
      required: true,
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        question: String,
        correctAnswer: String,
        userAnswer: String,
        feedback: String,
        rating: Number,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const InterviewAttempt =
  mongoose.models.InterviewAttempt ||
  mongoose.model("InterviewAttempt", interviewAttemptSchema);
export default InterviewAttempt;
