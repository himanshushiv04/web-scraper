import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      default: "",
    },
    points: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      trim: true,
      default: "unknown",
    },
    postedAt: {
      type: String,
      default: "",
    },
    hnId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export const Story = mongoose.model("Story", storySchema);
