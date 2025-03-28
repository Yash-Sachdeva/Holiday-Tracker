import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './HRDashboard.css';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { logout, userRole } = useAuth();
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    joiningDate: '',
    salary: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userRole !== 'HR') {
      navigate('/hr-login');
      return;
    }
    if (activeSection === 'employees') {
      fetchEmployees();
    }
  }, [userRole, navigate, activeSection]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/auth/all/employee', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/register/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) throw new Error('Failed to add employee');

      await fetchEmployees();
      setIsAddEmployeeModalOpen(false);
      setNewEmployee({
        name: '',
        email: '',
        password: '',
        department: '',
        position: '',
        joiningDate: '',
        salary: ''
      });
    } catch (err) {
      setError('Failed to add employee. Please try again.');
    }
  };

  const handleDeleteEmployee = async (employee) => {
    if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) return;

    try {
      const response = await fetch('http://localhost:8080/auth/delete/employee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(employee)
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      await fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      logout();
      navigate('/hr-login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-home">
            <div className="welcome-banner">
              <div className="welcome-text">
                <h2>Welcome back, HR Manager</h2>
                <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-icon employees">
                  <i className="fas fa-users"></i>
                </div>
                <div className="analytics-info">
                  <h3>Total Employees</h3>
                  <div className="analytics-number">{employees.length}</div>
                  <p className="analytics-trend positive">+5% from last month</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-icon departments">
                  <i className="fas fa-building"></i>
                </div>
                <div className="analytics-info">
                  <h3>Departments</h3>
                  <div className="analytics-number">8</div>
                  <p>Active departments</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-icon leave">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="analytics-info">
                  <h3>Leave Requests</h3>
                  <div className="analytics-number">12</div>
                  <p>Pending approval</p>
                </div>
              </div>

              <div className="analytics-card">
                <div className="analytics-icon attendance">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="analytics-info">
                  <h3>Today's Attendance</h3>
                  <div className="analytics-number">95%</div>
                  <p className="analytics-trend positive">+2% from yesterday</p>
                </div>
              </div>
            </div>

            <div className="dashboard-sections">
              <div className="section-card recent-activities">
                <h3>Recent Activities</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon new-employee"></div>
                    <div className="activity-details">
                      <p>New employee John Doe added</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon leave-request"></div>
                    <div className="activity-details">
                      <p>Leave request from Sarah Smith</p>
                      <span>4 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon department-update"></div>
                    <div className="activity-details">
                      <p>IT Department updated</p>
                      <span>Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="section-card department-overview">
                <h3>Department Overview</h3>
                <div className="department-stats">
                  <div className="dept-item">
                    <span className="dept-name">Engineering</span>
                    <div className="dept-bar">
                      <div className="dept-progress" style={{ width: '75%' }}></div>
                    </div>
                    <span className="dept-count">45 employees</span>
                  </div>
                  <div className="dept-item">
                    <span className="dept-name">Marketing</span>
                    <div className="dept-bar">
                      <div className="dept-progress" style={{ width: '60%' }}></div>
                    </div>
                    <span className="dept-count">30 employees</span>
                  </div>
                  <div className="dept-item">
                    <span className="dept-name">Sales</span>
                    <div className="dept-bar">
                      <div className="dept-progress" style={{ width: '45%' }}></div>
                    </div>
                    <span className="dept-count">25 employees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'employees':
        return (
          <div className="section-content">
            <div className="actions-bar">
              <h2>Employee Management</h2>
              <button 
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="add-employee-btn"
              >
                Add New Employee
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading">Loading employees...</div>
            ) : (
              <div className="employees-grid">
                {employees.map((employee) => (
                  <div key={employee.id} className="employee-card">
                    <div className="employee-header">
                      <h3>{employee.name}</h3>
                      <button
                        onClick={() => handleDeleteEmployee(employee)}
                        className="delete-btn"
                      >
                        ×
                      </button>
                    </div>
                    <div className="employee-info">
                      <p><strong>Email:</strong> {employee.email}</p>
                      <p><strong>Department:</strong> {employee.department}</p>
                      <p><strong>Position:</strong> {employee.position}</p>
                      <p><strong>Joining Date:</strong> {employee.joiningDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'leaves':
        return (
          <div className="section-content">
            <h2>Leave Management</h2>
            <p>Leave management features coming soon...</p>
          </div>
        );

      case 'attendance':
        return (
          <div className="section-content">
            <h2>Attendance Tracking</h2>
            <p>Attendance tracking features coming soon...</p>
          </div>
        );

      case 'reports':
        return (
          <div className="section-content">
            <h2>Reports & Analytics</h2>
            <p>Reporting features coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="hr-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h1>HR Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-menu">
            <button 
              className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveSection('dashboard')}
            >
              Dashboard Home
            </button>
            <button 
              className={`menu-item ${activeSection === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveSection('employees')}
            >
              Employee Management
            </button>
            <button 
              className={`menu-item ${activeSection === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveSection('leaves')}
            >
              Leave Management
            </button>
            <button 
              className={`menu-item ${activeSection === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveSection('attendance')}
            >
              Attendance Tracking
            </button>
            <button 
              className={`menu-item ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveSection('reports')}
            >
              Reports & Analytics
            </button>
          </div>
        </aside>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>

      {isAddEmployeeModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button 
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="add-employee-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="joiningDate">Joining Date</label>
                <input
                  type="date"
                  id="joiningDate"
                  value={newEmployee.joiningDate}
                  onChange={(e) => setNewEmployee({...newEmployee, joiningDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Add Employee</button>
                <button 
                  type="button" 
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;



