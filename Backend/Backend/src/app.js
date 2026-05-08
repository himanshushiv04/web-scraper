import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import storyRouter from "./routes/story.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5174", 
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/stories", storyRouter);

// POST /api/scrape alias
app.post("/api/scrape", async (req, res, next) => {
  try {
    const { scrapeHackerNews } = await import("./utils/scraper.js");
    const stories = await scrapeHackerNews();
    res.status(200).json({ success: true, message: "Scrape successful", count: stories.length });
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export { app };
