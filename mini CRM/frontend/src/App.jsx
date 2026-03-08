import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ContactForm from './pages/ContactForm';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

// Simple Private Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Route - The Website Form */}
          <Route path="/" element={<ContactForm />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Dashboard (Protected) */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
