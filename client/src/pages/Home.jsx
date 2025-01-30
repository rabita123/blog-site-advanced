import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import PostCard from '../components/PostCard';
import { getImageUrl } from '../utils/imageUtils';

// Lazy load components
const DarkModeToggle = lazy(() => import('../components/DarkModeToggle'));

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset posts when component mounts
    setPosts([]);
    setPage(1);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/posts?page=${page}&limit=6`);
      
      // Debug logs
      console.log('\n=== Posts Received in Frontend ===');
      response.data.posts.forEach(post => {
        console.log({
          id: post._id,
          title: post.title,
          image: post.image,
          author: post.author,
          category: post.category,
          createdAt: post.createdAt
        });
      });
      console.log('===============================\n');

      // If it's page 1, replace posts, otherwise append
      if (page === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...new Set([...prev, ...response.data.posts])]);
      }
      
      setHasMore(page < response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-500 text-lg font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white text-center mb-8">
            Welcome to Our Blog
          </h1>
          <p className="text-xl text-white/80 text-center max-w-2xl mx-auto">
            Discover insightful articles about technology, programming, and more.
          </p>
        </div>
        <div className="absolute bottom-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="currentColor" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {posts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Featured Post
            </h2>
            <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
              <div className="relative h-[400px] sm:h-[500px]">
                <img
                  src={getImageUrl(posts[0].image) || '/placeholder.jpg'}
                  alt={posts[0].title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="inline-block px-4 py-1 bg-blue-500 text-white text-sm rounded-full mb-4">
                      {posts[0].category}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                      {posts[0].title}
                    </h2>
                    <p className="text-lg text-white/90 mb-6 line-clamp-2">
                      {posts[0].content}
                    </p>
                    <Link
                      to={`/post/${posts[0]._id}`}
                      className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Read More
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest Posts */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Latest Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Suspense 
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-t-xl"></div>
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-b-xl">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            >
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </Suspense>
          </div>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-blue-600 rounded-full animate-spin"></div>
            </div>
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