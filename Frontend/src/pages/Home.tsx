import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

interface Story {
  _id: string;
  title: string;
  url: string;
  points: number;
  author: string;
  postedAt: string;
}

const Home = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<Story[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchStories = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/stories?page=${p}&limit=${limit}`);
      setStories(data.data.stories);
      setTotalPages(data.data.pagination.totalPages);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const { data } = await api.get("/stories/bookmarks");
      setBookmarkedIds(new Set(data.data.map((s: Story) => s._id)));
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  useEffect(() => {
    if (user) fetchBookmarks();
    else setBookmarkedIds(new Set());
  }, [user]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await api.post("/scrape");
      await fetchStories(1);
      setPage(1);
    } catch {
      // silent
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Top Stories</h1>
        <button onClick={handleScrape} disabled={scraping} className="btn btn-primary">
          {scraping ? "Scraping..." : "🔄 Refresh Stories"}
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading stories...</div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <p>No stories yet. Click "Refresh Stories" to scrape Hacker News.</p>
        </div>
      ) : (
        <>
          <div className="stories-list">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                initialBookmarked={bookmarkedIds.has(story._id)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-outline"
              >
                ← Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-outline"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
