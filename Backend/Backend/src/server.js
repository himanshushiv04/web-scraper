import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { scrapeHackerNews } from "./utils/scraper.js";

dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.log("ERR: ", err);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT || 8000}`);
    });

    // Auto-scrape on server start
    scrapeHackerNews().catch((err) =>
      console.error("Initial scrape failed:", err.message)
    );
  })
  .catch((error) => {
    console.log("MongoDB connection failed!", error);
  });