import { useState, useEffect } from 'react';
import '../styles/EmployeeManagement.css';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    joinDate: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/all/employee', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployee
        ? 'http://localhost:8080/auth/update/employee'
        : 'http://localhost:8080/auth/register/employee';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const employeeData = editingEmployee
        ? { ...formData, id: editingEmployee.id }
        : formData;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Failed to ${editingEmployee ? 'update' : 'add'} employee`);
      }
      
      await fetchEmployees();
      setShowAddForm(false);
      setEditingEmployee(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        department: '',
        position: '',
        joinDate: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (employee) => {
    try {
      const response = await fetch('http://localhost:8080/auth/delete/employee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete employee');
      
      await fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      joinDate: employee.joinDate
    });
    setShowAddForm(true);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="employee-management">
      <div className="page-header">
        <h2>Employee Management</h2>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="content-section">
        <div className="section-header">
          <h3>Employee List</h3>
          <button 
            className="add-employee-btn"
            onClick={() => {
              if (showAddForm) {
                setEditingEmployee(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  department: '',
                  position: '',
                  joinDate: ''
                });
              }
              setShowAddForm(!showAddForm);
            }}
          >
            {showAddForm ? 'Cancel' : 'Add Employee'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="joinDate">Join Date</label>
                <input
                  type="date"
                  id="joinDate"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              {editingEmployee ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        )}

        <div className="employees-grid">
          {employees.map(employee => (
            <div key={employee.id} className="employee-card">
              <div className="employee-info">
                <h3>{`${employee.firstName} ${employee.lastName}`}</h3>
                <p className="position">{employee.position}</p>
                <p className="department">{employee.department}</p>
                <p className="email">{employee.email}</p>
                <p className="join-date">Joined: {new Date(employee.joinDate).toLocaleDateString()}</p>
              </div>
              <div className="card-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(employee)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;


