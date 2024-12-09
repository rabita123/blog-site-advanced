import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axios';

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          axios.get(`/api/posts/${id}`),
          axios.get(`/api/posts/${id}/comments`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch post details');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      const response = await axios.post(`/api/posts/${id}/comments`, {
        content: newComment.trim()
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (err) {
      setError('Failed to post comment');
      console.error('Error:', err);
    } finally {
      setCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Posts
        </button>
        <div className="text-center py-10">
          <p className="text-red-500">{error || 'Post not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-500 hover:text-blue-600"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Posts
      </button>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 text-sm mb-6">
            <span className="mr-4">By {post.author}</span>
            <span className="mr-4">•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {post.image && (
            <div className="mb-6">
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={commenting}
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                  commenting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {commenting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
              <Link to="/login" className="text-blue-500 hover:text-blue-600">
                Sign in to comment
              </Link>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-gray-900">
                      {comment.authorName}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}

            {comments.length === 0 && (
              <p className="text-center text-gray-500">No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetails; 