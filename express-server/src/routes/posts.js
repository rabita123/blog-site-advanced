const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// GET /api/posts - Fetch all posts with search and filter
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Build search query
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },  // Case-insensitive title search
          { content: { $regex: search, $options: 'i' } } // Case-insensitive content search
        ]
      };
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts);
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

// POST /api/posts - Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const post = new Post({
      title,
      content,
      author,
      category
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/posts/:id - Update a post
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, author, category } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Update fields if provided
    if (title) post.title = title;
    if (content) post.content = content;
    if (author) post.author = author;
    if (category) post.category = category;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.remove();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid post ID' });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 