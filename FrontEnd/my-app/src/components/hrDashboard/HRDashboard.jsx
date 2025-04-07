import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './components/Sidebar';
import DashboardHome from './components/DashboardHome';
import EmployeeManagement from './components/EmployeeManagement';
import HolidayManagement from './components/HolidayManagement';
import MobileMenuToggle from './components/MobileMenuToggle';
import './styles/HRDashboard.css';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/logout/hr', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        await logout();
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Network error during logout. Please try again.');
    }
  };

  return (
    <div className="hr-dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <MobileMenuToggle onToggle={setIsMobileMenuOpen} />
          <h1>HR Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <Sidebar isOpen={isMobileMenuOpen} />
        <main className="dashboard-main">
          {error && <div className="error-message">{error}</div>}
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="holidays" element={<HolidayManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;







