const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// GET /api/posts/:postId/comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/posts/:postId/comments
router.post('/', auth, async (req, res) => {
  try {
    const comment = new Comment({
      content: req.body.content,
      post: req.params.postId,
      author: req.user.userId,
      authorName: req.user.username
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Protected route - Admin can delete comments
router.delete('/:commentId', 
  auth, 
  checkRole(['admin']), 
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      await comment.remove();
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router; 