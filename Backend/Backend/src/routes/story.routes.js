import { Router } from "express";
import {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarks,
  triggerScrape,
} from "../controllers/story.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/scrape", triggerScrape);
router.get("/", getAllStories);
router.get("/bookmarks", verifyJWT, getBookmarks);
router.get("/:id", getStoryById);
router.post("/:id/bookmark", verifyJWT, toggleBookmark);

export default router;
