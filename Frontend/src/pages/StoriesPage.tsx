import React, { useEffect, useState, useCallback } from 'react';
import { fetchStories, triggerScrape } from '../api/api';
import StoryCard from '../components/StoryCard';
import Toast from '../components/Toast';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-line medium" />
    <div className="skeleton-line short" />
  </div>
);

const StoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadStories = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data: response } = await fetchStories(page, 10);
      setStories(response.data.stories);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch {
      showToast('Failed to load stories', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadStories(1);
  }, [loadStories]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      const { data: response } = await triggerScrape();
      showToast(`Scraped ${response.data.count} stories successfully`);
      await loadStories(1);
    } catch {
      showToast('Scrape failed', 'error');
    } finally {
      setScraping(false);
    }
  };

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadStories(page);
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Top Stories</h1>
          <p className="page-subtitle">
            {pagination.total} stories · sorted by points
          </p>
        </div>
        <button
          className={`scrape-btn${scraping ? ' loading' : ''}`}
          onClick={handleScrape}
          disabled={scraping}
        >
          {scraping ? '⟳ Scraping...' : '⟳ Refresh from HN'}
        </button>
      </div>

      <div className="story-list">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : stories.length === 0
          ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <div className="empty-title">No stories yet</div>
              <div className="empty-text">Click "Refresh from HN" to scrape stories</div>
            </div>
          )
          : stories.map((story, idx) => (
            <StoryCard
              key={story._id}
              story={story}
              rank={(pagination.page - 1) * 10 + idx + 1}
              showToast={showToast}
            />
          ))
        }
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            ‹
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn${p === pagination.page ? ' active' : ''}`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
            disabled={pagination.page === pagination.pages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            ›
          </button>
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

export default StoriesPage;
