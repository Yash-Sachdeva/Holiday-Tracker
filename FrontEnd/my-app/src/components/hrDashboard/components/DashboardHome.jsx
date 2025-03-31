import { useState, useEffect } from 'react';
import '../styles/DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalEmployees: 156,
    activeLeaves: 8,
    pendingRequests: 5,
    attendanceToday: 145
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'leave',
      employee: 'John Smith',
      action: 'Leave Request',
      status: 'Pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'attendance',
      employee: 'Sarah Johnson',
      action: 'Clock In',
      status: 'Completed',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'profile',
      employee: 'Mike Wilson',
      action: 'Profile Update',
      status: 'Completed',
      time: '5 hours ago'
    }
  ]);

  const [departmentStats] = useState([
    { name: 'Engineering', employees: 45, attendance: 92, leaves: 3 },
    { name: 'Marketing', employees: 28, attendance: 88, leaves: 2 },
    { name: 'Sales', employees: 35, attendance: 95, leaves: 1 },
    { name: 'HR', employees: 12, attendance: 100, leaves: 0 }
  ]);

  return (
    <div className="dashboard-home">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, HR Manager</h2>
          <p>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon employees">👥</div>
          <div className="card-content">
            <h3>Total Employees</h3>
            <p className="stat-number">{stats.totalEmployees}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon leaves">📅</div>
          <div className="card-content">
            <h3>Active Leaves</h3>
            <p className="stat-number">{stats.activeLeaves}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon requests">📋</div>
          <div className="card-content">
            <h3>Pending Requests</h3>
            <p className="stat-number">{stats.pendingRequests}</p>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon attendance">⏰</div>
          <div className="card-content">
            <h3>Today's Attendance</h3>
            <p className="stat-number">{stats.attendanceToday}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section recent-activities">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {activity.type === 'leave' ? '📅' : 
                   activity.type === 'attendance' ? '⏰' : '👤'}
                </div>
                <div className="activity-details">
                  <p className="activity-title">
                    <strong>{activity.employee}</strong> - {activity.action}
                  </p>
                  <p className="activity-meta">
                    <span className={`status ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                    <span className="time">{activity.time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section department-stats">
          <h3>Department Overview</h3>
          <div className="department-grid">
            {departmentStats.map((dept, index) => (
              <div key={index} className="department-card">
                <h4>{dept.name}</h4>
                <div className="dept-stats">
                  <div className="dept-stat">
                    <span className="label">Employees</span>
                    <span className="value">{dept.employees}</span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">Attendance</span>
                    <span className="value">{dept.attendance}%</span>
                  </div>
                  <div className="dept-stat">
                    <span className="label">On Leave</span>
                    <span className="value">{dept.leaves}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
