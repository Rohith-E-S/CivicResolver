import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    latitude: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    longitude: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    landmark: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    beforeImageUrl: {
      type: String,
      lowercase: true,
    },
    afterImageUrl: {
      type: String,
      lowercase: true,
    },
    category: {
      type: String,
      enum: [
        "road_damage",
        "garbage_issue",
        "water_leakage",
        "electricity_issue",
        "tree_fallen",
        "accident",
        "fire",
        "drainage_problem",
        "noise_issue",
        "other",
      ],
      default: "other",
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "in progress", "resolved"],
      default: "new",
      lowercase: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;
