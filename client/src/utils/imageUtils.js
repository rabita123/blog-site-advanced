const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${API_URL}${imagePath}`;
}; 