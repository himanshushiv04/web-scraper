import { useState } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Story {
  _id: string;
  title: string;
  url: string;
  points: number;
  author: string;
  postedAt: string;
}

interface Props {
  story: Story;
  initialBookmarked?: boolean;
  onUnbookmark?: (id: string) => void;
}

const StoryCard = ({ story, initialBookmarked = false, onUnbookmark }: Props) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post(`/stories/${story._id}/bookmark`);
      setBookmarked(data.data.bookmarked);
      if (!data.data.bookmarked && onUnbookmark) {
        onUnbookmark(story._id);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const domain = story.url
    ? (() => {
        try {
          return new URL(story.url).hostname.replace("www.", "");
        } catch {
          return "";
        }
      })()
    : "";

  return (
    <div className="story-card">
      <div className="story-points">
        <span>{story.points}</span>
        <span className="points-label">pts</span>
      </div>
      <div className="story-content">
        <a
          href={story.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="story-title"
        >
          {story.title}
        </a>
        {domain && <span className="story-domain">({domain})</span>}
        <div className="story-meta">
          <span>by {story.author}</span>
          <span className="dot">·</span>
          <span>{story.postedAt}</span>
        </div>
      </div>
      <button
        onClick={handleBookmark}
        disabled={loading}
        className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
        title={bookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {bookmarked ? "★" : "☆"}
      </button>
    </div>
  );
};

export default StoryCard;
