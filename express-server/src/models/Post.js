const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: String,
    default: 'Anonymous'
  },
  category: {
    type: String,
    default: 'Uncategorized'
  }
}, {
  // This will automatically add createdAt and updatedAt fields
  timestamps: true
});

// Add index for better query performance
postSchema.index({ category: 1, createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 