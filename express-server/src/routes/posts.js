const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const upload = require('../config/multer');

// Serve static files
router.use('/uploads', express.static('public/uploads'));

// GET /api/posts - Fetch all posts with search, filter, and pagination
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 6 } = req.query;
    let query = {};

    // Build search query
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Fetch paginated posts
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Send pagination metadata
    res.json({
      posts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/posts/:id - Fetch a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(500).json({ message: error.message });
  }
});

// Protected routes - Admin only
router.post('/', 
  auth, 
  checkRole(['admin']), 
  upload.single('image'), 
  async (req, res) => {
    try {
      const { title, content, author, category } = req.body;

      if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
      }

      const post = new Post({
        title,
        content,
        author: author || req.user.username,
        category,
        image: req.file ? `/api/posts/uploads/${req.file.filename}` : null
      });

      const savedPost = await post.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// PUT /api/posts/:id - Update a post with image
router.put('/:id', 
  auth, 
  checkRole(['admin']), 
  upload.single('image'), 
  async (req, res) => {
    try {
      const { title, content, author, category } = req.body;
      
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Update fields
      if (title) post.title = title;
      if (content) post.content = content;
      if (author) post.author = author;
      if (category) post.category = category;
      if (req.file) {
        post.image = `/api/posts/uploads/${req.file.filename}`;
      }

      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', 
  auth, 
  checkRole(['admin']), 
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      await post.remove();
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router; 