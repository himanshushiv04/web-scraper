import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import StoryCard from "../components/StoryCard";

interface Story {
  _id: string;
  title: string;
  url: string;
  points: number;
  author: string;
  postedAt: string;
}

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const { data } = await api.get("/stories/bookmarks");
      setBookmarks(data.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleUnbookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Bookmarks</h1>
        <span className="badge">{bookmarks.length} saved</span>
      </div>

      {loading ? (
        <div className="loading-state">Loading bookmarks...</div>
      ) : bookmarks.length === 0 ? (
        <div className="empty-state">
          <p>No bookmarks yet. Star stories on the home page to save them here.</p>
        </div>
      ) : (
        <div className="stories-list">
          {bookmarks.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              initialBookmarked={true}
              onUnbookmark={handleUnbookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
