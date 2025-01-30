import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MobileMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 left-0 bg-white shadow-lg p-4 border-t">
          {user ? (
            <div className="space-y-4">
              <div className="px-4 py-2 text-gray-600 border-b border-gray-100">
                Welcome, {user.username}
              </div>

              {user.role === 'admin' && (
                <div className="space-y-2">
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                  >
                    <span>Admin Panel</span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isAdminMenuOpen && (
                    <div className="pl-4 space-y-2">
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/new-post"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Create Post
                      </Link>
                      <Link
                        to="/admin/manage-posts"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        Manage Posts
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Link
                to="/login"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileMenu; 