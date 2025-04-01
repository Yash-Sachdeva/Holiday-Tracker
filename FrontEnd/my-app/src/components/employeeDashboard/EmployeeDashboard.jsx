import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './EmployeeDashboard.css';

const MOCK_HOLIDAYS = [
  {
    id: 1,
    name: "New Year's Day",
    date: "2025-04-08",
    description: "New Year's Day Celebration"
  }
];

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
  const [events, setEvents] = useState([]);
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);

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

  useEffect(() => {
    // Set upcoming holidays - next 3 holidays
    if (holidays.length) {
      const today = new Date();
      const upcoming = holidays
        .filter(h => new Date(h.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setUpcomingHolidays(upcoming);
    }
  }, [holidays]);

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
      // Comment out the API call
      /*
      const response = await fetch('http://localhost:8080/api/holidays', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setHolidays(data);
      */
      
      // Use hardcoded data instead
      setHolidays(MOCK_HOLIDAYS);
      
      // Create events for the calendar view
      const eventsData = MOCK_HOLIDAYS.map(holiday => ({
        id: holiday.id,
        type: 'holiday',
        title: holiday.name,
        date: new Date(holiday.date),
        description: holiday.description
      }));
      setEvents(eventsData);
      
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

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateString = date.toDateString();
    
    // Check if date is today
    const isToday = new Date().toDateString() === dateString;
    
    // Check if date is a holiday
    const holiday = holidays.find(h => new Date(h.date).toDateString() === dateString);
    
    // Check if date is weekend
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    if (holiday) return 'holiday-tile';
    if (isToday) return 'today-tile';
    if (isWeekend) return 'weekend-tile';
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateEvents = events.filter(
      event => event.date.toDateString() === date.toDateString()
    );
    
    if (dateEvents.length > 0) {
      return (
        <div className="event-indicator">
          {dateEvents.map(event => (
            <div key={event.id} className={`indicator ${event.type}`} title={event.title}></div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDateClick = (date) => {
    const holiday = holidays.find(h => new Date(h.date).toDateString() === date.toDateString());
    setSelectedDate(date);
    setHolidayDetails(holiday);
  };

  const formatMonthYear = (locale, date) => {
    return date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
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
        <div className="dashboard-header">
          <h1>Employee Dashboard</h1>
          <p className="welcome-message">Welcome back, {userData.name}!</p>
        </div>

        <div className="dashboard-grid">
          <div className="calendar-section">
            <div className="calendar-card">
              <div className="card-header">
                <h2>Company Calendar</h2>
                <div className="calendar-legend">
                  <span className="legend-item"><span className="dot holiday-dot"></span> Holiday</span>
                  <span className="legend-item"><span className="dot today-dot"></span> Today</span>
                  <span className="legend-item"><span className="dot weekend-dot"></span> Weekend</span>
                </div>
              </div>
              
              <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileClassName={tileClassName}
                tileContent={tileContent}
                formatMonthYear={formatMonthYear}
                nextLabel={<span className="calendar-nav">›</span>}
                prevLabel={<span className="calendar-nav">‹</span>}
                next2Label={<span className="calendar-nav">»</span>}
                prev2Label={<span className="calendar-nav">«</span>}
                showNeighboringMonth={false}
                className="custom-calendar"
              />
            </div>
          </div>

          <div className="date-details-section">
            <div className="date-details-card">
              <h3>Selected Date</h3>
              <div className="selected-date">
                <div className="date-number">{selectedDate.getDate()}</div>
                <div className="date-info">
                  <span className="date-month">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long' })}
                  </span>
                  <span className="date-year">{selectedDate.getFullYear()}</span>
                </div>
              </div>

              {holidayDetails ? (
                <div className="holiday-details">
                  <div className="holiday-badge">Holiday</div>
                  <h4>{holidayDetails.name}</h4>
                  <p>{holidayDetails.description}</p>
                </div>
              ) : (
                <p className="no-events">No events on this date</p>
              )}
            </div>

            <div className="upcoming-holidays-card">
              <h3>Upcoming Holidays</h3>
              {upcomingHolidays.length > 0 ? (
                <ul className="upcoming-list">
                  {upcomingHolidays.map((holiday, index) => (
                    <li key={index} className="upcoming-item">
                      <div className="upcoming-date">
                        {new Date(holiday.date).toLocaleDateString('en-US', { 
                          day: 'numeric',
                          month: 'short'
                        })}
                      </div>
                      <div className="upcoming-details">
                        <strong>{holiday.name}</strong>
                        <span>
                          {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-events">No upcoming holidays</p>
              )}
            </div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </main>
    </div>
  );
};

export default EmployeeDashboard;

