import React, { useEffect, useState, useCallback } from 'react';
import { getMe } from '../api/api';
import StoryCard from '../components/StoryCard';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const BookmarksPage = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { updateBookmarks } = useAuth();

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const { data: response } = await getMe();
      setStories(response.data.bookmarks || []);
      updateBookmarks(response.data.bookmarks || []);
    } catch {
      showToast('Failed to load bookmarks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, updateBookmarks]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Reload after bookmark toggle
  const handleToast = useCallback((msg, type) => {
    showToast(msg, type);
    loadBookmarks();
  }, [showToast, loadBookmarks]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Bookmarks</h1>
          <p className="page-subtitle">{stories.length} saved stories</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-screen"><div className="spinner" /></div>
      ) : stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">☆</div>
          <div className="empty-title">No bookmarks yet</div>
          <div className="empty-text">Star stories from the home page to save them here</div>
        </div>
      ) : (
        <div className="story-list">
          {stories.map((story, idx) => (
            <StoryCard
              key={story._id}
              story={story}
              rank={idx + 1}
              showToast={handleToast}
            />
          ))}
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default BookmarksPage;
