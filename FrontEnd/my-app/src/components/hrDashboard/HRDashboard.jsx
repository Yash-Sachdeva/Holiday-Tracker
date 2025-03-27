import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HRDashboard.css';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState('');
  const [hrData, setHRData] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/session/hr', {
        credentials: 'include'
      });
      const data = await response.text();
      
      if (data.includes('No active session found')) {
        navigate('/hr-login');
      }
    } catch (err) {
      setError('Failed to verify authentication');
      navigate('/hr-login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/logout/hr', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        logout();
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (err) {
      setError('Network error during logout. Please try again.');
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>HR Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Employee Management</h3>
            <button className="action-btn">Manage Employees</button>
          </div>

          <div className="dashboard-card">
            <h3>Leave Requests</h3>
            <button className="action-btn">View Requests</button>
          </div>

          <div className="dashboard-card">
            <h3>Holiday Calendar</h3>
            <button className="action-btn">Manage Calendar</button>
          </div>

          <div className="dashboard-card">
            <h3>Reports</h3>
            <button className="action-btn">Generate Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;

