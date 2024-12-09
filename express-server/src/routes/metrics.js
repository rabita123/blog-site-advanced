const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

router.get('/', async (req, res) => {
  try {
    // Get total posts
    const totalPosts = await Post.countDocuments();

    // Get posts by category
    const postsByCategory = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count' } }
    ]);

    // Mock data for views (you'll need to implement actual view tracking)
    const viewsByDay = Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      views: Math.floor(Math.random() * 100)
    })).reverse();

    res.json({
      totalPosts,
      totalViews: viewsByDay.reduce((sum, day) => sum + day.views, 0),
      totalComments: await Comment.countDocuments(),
      viewsByDay,
      postsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 