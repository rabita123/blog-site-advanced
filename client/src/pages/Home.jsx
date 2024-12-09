import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import PostCard from '../components/PostCard';
import HeroCarousel from '../components/HeroCarousel';
import DarkModeToggle from '../components/DarkModeToggle';

function Home() {
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        const allPosts = response.data.posts;
        
        // Get 3 random posts for featured section
        const featured = [...allPosts]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        setFeaturedPosts(featured);
        setPosts(allPosts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch posts');
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroCarousel featuredPosts={featuredPosts} />

        {/* Recent Posts Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="transform hover:-translate-y-1 transition-transform duration-200"
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <DarkModeToggle />
    </div>
  );
}

export default Home; 