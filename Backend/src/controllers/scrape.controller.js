import axios from "axios";
import { Story } from "../models/story.model.js";
import { load as cheerio } from "cheerio";
import { asyncHandler } from "../utils/asyncHandler.js";

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com', {      
        headers: {  
            'User-Agent': 'Mozilla/5.0 (compatible; HN-Scraper/1.0)',
        },
        timeout: 10000,
    });
    const $ = cheerio.load(data);

    const stories = [];
    $('.athing').slice(0, 10).each((i, el) => {
        const hnId = $(el).attr('id');  
        const titleEl = $(el).find('.titleline > a').first();
        const title = titleEl.text().trim();
        const url = titleEl.attr('href') || '';
        const subtext = $(el).next('.subtext');
        const points = parseInt(subtext.find('.score').text()) || 0;
        const author = subtext.find('.hnuser').text().trim() || 'unknown';
        const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text().trim() || '';
        if (title) {
            stories.push({ hnId, title, url, points, author, postedAt });
        }
    });

    let saved = 0;  
    for (const story of stories) {
        await Story.findOneAndUpdate(
            { hnId: story.hnId },
            story,  
            { upsert: true, new: true }
        );

        saved++;
    }   
    return { success: true, count: saved, stories };
    } catch (error) {   
        console.error('Scrape error:', error.message);
        throw new Error(`Scraping failed: ${error.message}`);
    }
};

const triggerScrape = asyncHandler(async (req, res) => {
    try {
        const result = await scrapeHackerNews();
        res.json({
            status: 200,    
            message: 'Scrape complete',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        });
    }
});

export { triggerScrape };
