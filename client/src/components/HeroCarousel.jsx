import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeroCarousel({ featuredPosts }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredPosts.length]);

  return (
    <div className="relative h-[500px] overflow-hidden rounded-xl mb-12">
      {featuredPosts.map((post, index) => (
        <div
          key={post._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <img
            src={post.image || 'https://via.placeholder.com/1200x500'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <span className="inline-block px-4 py-1 bg-blue-500 rounded-full text-sm mb-4">
              {post.category}
            </span>
            <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
            <p className="text-lg mb-4 line-clamp-2">{post.content}</p>
            <Link
              to={`/post/${post._id}`}
              className="inline-block px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {featuredPosts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel; 