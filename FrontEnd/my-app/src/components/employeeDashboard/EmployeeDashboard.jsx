import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, userRole, checkSession } = useAuth();
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('John Doe'); // Replace with actual user data
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated || userRole !== 'EMPLOYEE') {
        await checkSession();
        if (!isAuthenticated || userRole !== 'EMPLOYEE') {
          navigate('/employee-login');
        }
      }
    };
    
    verifyAuth();
    const sessionInterval = setInterval(checkSession, 5 * 60 * 1000);
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => {
      clearInterval(sessionInterval);
      clearInterval(timeInterval);
    };
  }, [isAuthenticated, userRole, navigate, checkSession]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/logout/employee', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        logout();
        navigate('/');
      } else {
        setError('Logout failed. Please try again.');
      }
    } catch (error) {
      setError('Network error during logout. Please try again.');
      console.error('Logout failed:', error);
    }
  };

  if (!isAuthenticated || userRole !== 'EMPLOYEE') {
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-left">
          <h1>Employee Dashboard</h1>
          <span className="current-time">
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <div className="nav-right">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="welcome-section">
          <h2>Welcome back, {userName}!</h2>
          <p>Here's your overview for today</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon leave-icon">📅</div>
            <h3>Leave Management</h3>
            <p>Request and track your leave applications</p>
            <button className="action-btn">Manage Leave</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon attendance-icon">⏰</div>
            <h3>Attendance</h3>
            <p>View your attendance records</p>
            <button className="action-btn">View Records</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon profile-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your personal information</p>
            <button className="action-btn">Edit Profile</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon payroll-icon">💰</div>
            <h3>Payroll</h3>
            <p>Access your salary statements</p>
            <button className="action-btn">View Payslips</button>
          </div>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <h4>Leave Balance</h4>
            <p className="stat-number">15 days</p>
          </div>
          <div className="stat-card">
            <h4>This Month</h4>
            <p className="stat-number">Present: 18 days</p>
          </div>
          <div className="stat-card">
            <h4>Pending Requests</h4>
            <p className="stat-number">2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

