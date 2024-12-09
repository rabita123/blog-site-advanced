import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Blog System
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-gray-900">
              Admin
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 