import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import { getImageUrl } from '../../utils/imageUtils';

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to fetch post');
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">{error || 'Post not found'}</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      <img
        src={getImageUrl(post.image)}
        alt={post.title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {post.title}
      </h1>
      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-8">
        <span>By {post.author}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{post.category}</span>
      </div>
      <div className="prose dark:prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  );
}

export default PostDetails; 