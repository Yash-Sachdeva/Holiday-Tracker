import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated, userRole, checkSession } = useAuth();
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering',
    position: 'Software Developer',
    joinDate: '01/01/2023',
    leaveBalance: 15,
  });
  const [holidays, setHolidays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [holidayDetails, setHolidayDetails] = useState(null);

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
    fetchUserData();
    fetchHolidays();

    const sessionInterval = setInterval(checkSession, 5 * 60 * 1000);
    return () => clearInterval(sessionInterval);
  }, [isAuthenticated, userRole, navigate, checkSession]);

  const fetchUserData = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('http://localhost:8080/api/employee/profile', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  const fetchHolidays = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('http://localhost:8080/api/holidays', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHolidays(data);
      }
    } catch (error) {
      setError('Failed to fetch holidays');
    }
  };

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
    }
  };

  const tileClassName = ({ date }) => {
    const holiday = holidays.find(h => new Date(h.date).toDateString() === date.toDateString());
    return holiday ? 'holiday-tile' : null;
  };

  const handleDateClick = (date) => {
    const holiday = holidays.find(h => new Date(h.date).toDateString() === date.toDateString());
    setSelectedDate(date);
    setHolidayDetails(holiday);
  };

  if (!isAuthenticated || userRole !== 'EMPLOYEE') {
    return null;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-profile">
          <div className="profile-image">
            <img src={userData.profileImage || '/default-avatar.png'} alt="Profile" />
          </div>
          <h2>{userData.name}</h2>
          <p className="user-title">{userData.position}</p>
        </div>

        <div className="user-info-section">
          <div className="info-item">
            <label>Department</label>
            <span>{userData.department}</span>
          </div>
          <div className="info-item">
            <label>Email</label>
            <span>{userData.email}</span>
          </div>
          <div className="info-item">
            <label>Join Date</label>
            <span>{userData.joinDate}</span>
          </div>
          <div className="info-item highlight">
            <label>Leave Balance</label>
            <span>{userData.leaveBalance} days</span>
          </div>
        </div>

        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="calendar-section">
          <h2>Holiday Calendar</h2>
          <Calendar
            onChange={handleDateClick}
            value={selectedDate}
            tileClassName={tileClassName}
          />
          
          {holidayDetails && (
            <div className="holiday-popup">
              <h3>{holidayDetails.name}</h3>
              <p>{holidayDetails.description}</p>
              <p>Date: {new Date(holidayDetails.date).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
};

export default EmployeeDashboard;



