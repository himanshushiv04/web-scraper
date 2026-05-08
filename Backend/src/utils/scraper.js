import axios from "axios";
import * as cheerio from "cheerio";
import { Story } from "../models/story.model.js";

const HN_URL = "https://news.ycombinator.com";

export const scrapeHackerNews = async () => {
  try {
    console.log("Scraping Hacker News...");
    const { data } = await axios.get(HN_URL, { timeout: 10000 });
    const $ = cheerio.load(data);

    const stories = [];

    $(".athing").each((i, el) => {
      if (stories.length >= 10) return false;

      const id = $(el).attr("id");
      const titleEl = $(el).find(".titleline > a").first();
      const title = titleEl.text().trim();
      const url = titleEl.attr("href") || "";

      // The subtext row is the next sibling
      const subtext = $(el).next(".subtext, tr");
      const pointsText = subtext.find(".score").text();
      const points = parseInt(pointsText) || 0;
      const author = subtext.find(".hnuser").text().trim() || "unknown";
      const postedAt = subtext.find(".age").attr("title") || subtext.find(".age").text().trim();

      if (title) {
        stories.push({ title, url, points, author, postedAt, hnId: id });
      }
    });

    // Upsert stories by hnId
    const ops = stories.map((story) => ({
      updateOne: {
        filter: { hnId: story.hnId },
        update: { $set: story },
        upsert: true,
      },
    }));

    if (ops.length > 0) {
      await Story.bulkWrite(ops);
    }

    console.log(`Scraped and saved ${stories.length} stories.`);
    return stories;
  } catch (error) {
    console.error("Scraping error:", error.message);
    throw error;
  }
};
