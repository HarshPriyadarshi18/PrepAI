import mongoose from "mongoose";

// NEW model — separate from the generic role-only Interview model.
// Used for company + role + round based interview prep.

const companyInterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    round: {
      type: String,
      enum: ["OA", "Technical1", "Technical2", "HR"],
      required: true,
      default: "Technical1",
    },

    questions: [String],

    answers: [String],

    score: {
      type: Number,
      default: 0,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CompanyInterview", companyInterviewSchema);