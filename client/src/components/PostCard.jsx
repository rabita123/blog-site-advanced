import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          <Link
            to={`/post/${post._id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-4">
          {post.content.substring(0, 150)}...
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 dark:text-gray-400 space-y-2 sm:space-y-0">
          <span>By {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-4">
          <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
            {post.category}
          </span>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-100 dark:border-gray-600">
        <Link
          to={`/post/${post._id}`}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm sm:text-base"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

export default PostCard; 