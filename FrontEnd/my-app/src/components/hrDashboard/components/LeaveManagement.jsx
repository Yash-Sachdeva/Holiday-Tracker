import { useState, useEffect } from 'react';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/leave-requests', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch leave requests');
      const data = await response.json();
      setLeaveRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/leave-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to update leave request');
      
      // Refresh the leave requests list
      await fetchLeaveRequests();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRequests = leaveRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status.toLowerCase() === filterStatus;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f1c40f',
      approved: '#2ecc71',
      rejected: '#e74c3c'
    };
    return colors[status.toLowerCase()] || '#95a5a6';
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="leave-management">
      <div className="header">
        <h2>Leave Management</h2>
        <div className="filter-section">
          <label htmlFor="status-filter">Filter by status:</label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="leave-requests-grid">
        {filteredRequests.map(request => (
          <div key={request.id} className="leave-request-card">
            <div className="employee-details">
              <h3>{request.employeeName}</h3>
              <p className="department">{request.department}</p>
            </div>
            
            <div className="leave-details">
              <div className="detail-row">
                <span className="label">Type:</span>
                <span className="value">{request.leaveType}</span>
              </div>
              <div className="detail-row">
                <span className="label">From:</span>
                <span className="value">
                  {new Date(request.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">To:</span>
                <span className="value">
                  {new Date(request.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Duration:</span>
                <span className="value">{request.duration} days</span>
              </div>
            </div>

            <div className="reason">
              <p className="label">Reason:</p>
              <p className="value">{request.reason}</p>
            </div>

            <div className="status-section">
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(request.status) }}
              >
                {request.status}
              </div>
              
              {request.status === 'PENDING' && (
                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => handleStatusChange(request.id, 'APPROVED')}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleStatusChange(request.id, 'REJECTED')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="no-requests">
          No leave requests found for the selected filter.
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;