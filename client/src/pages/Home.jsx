import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import LazyImage from '../components/LazyImage';

// Lazy load components
const PostCard = lazy(() => import('../components/PostCard'));
const DarkModeToggle = lazy(() => import('../components/DarkModeToggle'));

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=6`);
      setPosts(prev => [...prev, ...response.data.posts]);
      setHasMore(page < response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch posts');
      setLoading(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (hasMore) {
        setPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Posts Slider */}
        {posts.length > 0 && (
          <div className="mb-12 overflow-hidden rounded-lg shadow-lg">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
              <LazyImage
                src={posts[0].image || 'https://via.placeholder.com/1200x500'}
                alt={posts[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                    {posts[0].title}
                  </h2>
                  <p className="text-white/80 mb-4 line-clamp-2">
                    {posts[0].content}
                  </p>
                  <Link
                    to={`/post/${posts[0]._id}`}
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div>Loading posts...</div>}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Suspense>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Dark mode toggle */}
      <Suspense fallback={null}>
        <DarkModeToggle />
      </Suspense>
    </div>
  );
}

export default Home; 