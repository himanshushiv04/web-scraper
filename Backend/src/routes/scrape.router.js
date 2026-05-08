import { Router } from "express";
import { triggerScrape } from "../controllers/scrape.controller.js";

const router = Router();
router.post("/", triggerScrape);

export default router;
