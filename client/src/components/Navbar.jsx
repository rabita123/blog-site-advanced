import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MobileMenu from './MobileMenu';
import AdminSidebar from './AdminSidebar';

function Navbar() {
  const { user, logout } = useAuth();
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              {user?.role === 'admin' && (
                <button
                  onClick={() => setIsAdminSidebarOpen(!isAdminSidebarOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <Link to="/" className="text-xl font-bold text-gray-800">
                Blog Site
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">
                    Welcome, {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </div>
        </div>
      </nav>

      {/* Admin Sidebar */}
      {user?.role === 'admin' && (
        <AdminSidebar 
          isOpen={isAdminSidebarOpen} 
          onClose={() => setIsAdminSidebarOpen(false)} 
        />
      )}
    </>
  );
}

export default Navbar; 