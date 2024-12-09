import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

function PostForm({ initialData, mode = 'create' }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    author: initialData?.author || '',
    category: initialData?.category || ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataWithImage = new FormData();
      Object.keys(formData).forEach(key => {
        formDataWithImage.append(key, formData[key]);
      });
      if (image) {
        formDataWithImage.append('image', image);
      }

      if (mode === 'create') {
        await axios.post('/api/posts', formDataWithImage);
      } else {
        await axios.put(`/api/posts/${initialData._id}`, formDataWithImage);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${mode} post`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'create' ? 'Create New Post' : 'Edit Post'}
        </h1>
        <button
          onClick={() => navigate('/admin')}
          className="text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="6"
            placeholder="Write your post content here..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Backend">Backend</option>
            <option value="Frontend">Frontend</option>
            <option value="Database">Database</option>
            <option value="Security">Security</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Post Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg shadow-sm"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="mt-2 text-red-500 hover:text-red-700"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (mode === 'create' ? 'Creating...' : 'Saving...') : 
                      (mode === 'create' ? 'Create Post' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostForm; 