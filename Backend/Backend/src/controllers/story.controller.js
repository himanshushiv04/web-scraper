import { Story } from "../models/story.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { scrapeHackerNews } from "../utils/scraper.js";

export const triggerScrape = asyncHandler(async (req, res) => {
  const stories = await scrapeHackerNews();
  res.status(200).json(new ApiResponse(200, { count: stories.length }, "Scrape successful"));
});

export const getAllStories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Story.countDocuments();
  const stories = await Story.find().sort({ points: -1 }).skip(skip).limit(limit);

  res.status(200).json(
    new ApiResponse(200, {
      stories,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }, "Stories fetched successfully")
  );
});

export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw new ApiError(404, "Story not found");
  res.status(200).json(new ApiResponse(200, story, "Story fetched"));
});

export const toggleBookmark = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const storyId = req.params.id;

  const story = await Story.findById(storyId);
  if (!story) throw new ApiError(404, "Story not found");

  const alreadyBookmarked = user.bookmarks.includes(storyId);
  if (alreadyBookmarked) {
    user.bookmarks = user.bookmarks.filter((id) => id.toString() !== storyId);
  } else {
    user.bookmarks.push(storyId);
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json(
    new ApiResponse(200, { bookmarked: !alreadyBookmarked }, alreadyBookmarked ? "Bookmark removed" : "Bookmark added")
  );
});

export const getBookmarks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("bookmarks");
  res.status(200).json(new ApiResponse(200, user.bookmarks, "Bookmarks fetched"));
});
