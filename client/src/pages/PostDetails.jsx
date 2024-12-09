import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);
  const [error, setError] = useState(null);
  const [replyTo, setReplyTo] = useState(null);

  // Intersection Observer hooks for animations
  const [titleRef, titleInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [contentRef, contentInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const commentSectionRef = useRef(null);

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
        content: newComment.trim(),
        parentId: replyTo?.id
      });

      if (replyTo) {
        // Add reply to existing comment
        setComments(comments.map(comment => 
          comment._id === replyTo.id 
            ? { ...comment, replies: [...(comment.replies || []), response.data] }
            : comment
        ));
      } else {
        // Add new top-level comment
        setComments([response.data, ...comments]);
      }

      setNewComment('');
      setReplyTo(null);
      commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setError('Failed to post comment');
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
        <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-600 mb-4">
          ← Back
        </button>
        <div className="text-center py-10">
          <p className="text-red-500">{error || 'Post not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <article className="lg:w-2/3">
            <button onClick={() => navigate(-1)} className="text-blue-500 hover:text-blue-600 mb-8">
              ← Back to Posts
            </button>

            {/* Title Section */}
            <div 
              ref={titleRef}
              className={`mb-8 transform transition-all duration-1000 ${
                titleInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-600 text-sm space-x-4">
                <span>By {post.author}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Content Section */}
            <div 
              ref={contentRef}
              className={`prose max-w-none mb-12 transform transition-all duration-1000 delay-300 ${
                contentInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Comments Section */}
            <div ref={commentSectionRef} className="border-t pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Comments</h2>

              {/* Comment Form */}
              {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  {replyTo && (
                    <div className="mb-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-600">
                        Replying to {replyTo.authorName}'s comment
                      </span>
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={commenting}
                      className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                        commenting ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {commenting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                  <Link to="/login" className="text-blue-500 hover:text-blue-600">
                    Sign in to comment
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-8">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-gray-100 pb-8 last:border-0">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="font-medium text-gray-900">
                          {comment.authorName}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {user && (
                        <button
                          onClick={() => setReplyTo({
                            id: comment._id,
                            authorName: comment.authorName
                          })}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Reply
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700">{comment.content}</p>

                    {/* Nested Replies */}
                    {comment.replies?.length > 0 && (
                      <div className="mt-4 ml-8 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply._id} className="border-l-2 border-gray-100 pl-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {reply.authorName}
                                </span>
                                <span className="text-sm text-gray-500 ml-2">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-center text-gray-500">No comments yet</p>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                <Link
                  to={`/?category=${post.category}`}
                  className="inline-block bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 transition-colors"
                >
                  {post.category}
                </Link>
              </div>

              <hr className="my-6" />

              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Share
              </h3>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-blue-500 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default PostDetails; 