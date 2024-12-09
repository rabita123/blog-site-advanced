import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          <Link
            to={`/post/${post._id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-gray-600 mb-4">
          {post.content.substring(0, 150)}...
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>By {post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-4">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
            {post.category}
          </span>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t">
        <Link
          to={`/post/${post._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}

export default PostCard; 