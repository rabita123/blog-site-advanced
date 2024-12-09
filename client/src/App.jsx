import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import AdminDashboard from './pages/AdminDashboard';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/post/:id" element={<PostDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              
              {/* Protected Routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/new-post"
                element={
                  <PrivateRoute>
                    <NewPost />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/edit/:id"
                element={
                  <PrivateRoute>
                    <EditPost />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 