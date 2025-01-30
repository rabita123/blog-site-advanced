import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/public/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/admin/AdminDashboard';
import PostDetails from './pages/PostDetails';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import ManagePosts from './pages/ManagePosts';
import Overview from './pages/admin/Overview';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="posts" element={<ManagePosts />} />
              <Route path="new-post" element={<NewPost />} />
              <Route path="edit/:id" element={<EditPost />} />
              <Route path="post/:id" element={<PostDetails />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 