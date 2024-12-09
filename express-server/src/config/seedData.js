const mongoose = require('mongoose');
const Post = require('../models/Post');
const connectDB = require('./db');

const dummyPosts = [
  {
    title: "Getting Started with React",
    content: "React is a popular JavaScript library for building user interfaces. It was developed by Facebook and has become one of the most widely used frontend technologies. In this post, we'll explore the basics of React and how to get started with your first React application.",
    author: "John Doe",
    category: "Programming"
  },
  {
    title: "Introduction to MongoDB",
    content: "MongoDB is a powerful NoSQL database that offers great flexibility and scalability. It stores data in JSON-like documents, making it a perfect choice for JavaScript applications. This post covers the fundamentals of MongoDB and how to use it in your projects.",
    author: "Jane Smith",
    category: "Database"
  },
  {
    title: "Mastering Tailwind CSS",
    content: "Tailwind CSS is a utility-first CSS framework that has revolutionized how we style web applications. Instead of writing custom CSS, you can use predefined utility classes to build modern designs quickly. Learn how to leverage Tailwind CSS in your projects.",
    author: "Mike Johnson",
    category: "Design"
  },
  {
    title: "Node.js Best Practices",
    content: "Node.js has become the go-to runtime for building scalable backend applications. This post discusses best practices for building robust Node.js applications, including error handling, async/await patterns, and project structure.",
    author: "Sarah Wilson",
    category: "Backend"
  },
  {
    title: "Understanding JWT Authentication",
    content: "JSON Web Tokens (JWT) provide a secure way to handle authentication in modern web applications. This guide explains how JWT works, its benefits, and how to implement JWT authentication in your applications.",
    author: "Alex Brown",
    category: "Security"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing posts
    await Post.deleteMany({});
    console.log('Cleared existing posts');

    // Insert dummy posts
    const createdPosts = await Post.insertMany(dummyPosts);
    console.log(`Created ${createdPosts.length} posts`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 