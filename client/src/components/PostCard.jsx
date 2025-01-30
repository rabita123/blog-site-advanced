import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';

function PostCard({ post }) {
  const [imageError, setImageError] = useState(false);
  const defaultImage = '/placeholder.jpg';
  const imageUrl = getImageUrl(post.image);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={!imageError ? (imageUrl || defaultImage) : defaultImage}
          alt={post.title}
          className="w-full h-64 object-cover"
          onError={() => setImageError(true)}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            {post.category}
          </span>
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link
            to={`/post/${post._id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            By {post.author}
          </span>
          <Link
            to={`/post/${post._id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard; 