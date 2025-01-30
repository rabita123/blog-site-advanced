import axios from 'axios';

const fetchPosts = async (page = 1, limit = 6) => {
  try {
    const response = await axios.get(`/api/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}; 