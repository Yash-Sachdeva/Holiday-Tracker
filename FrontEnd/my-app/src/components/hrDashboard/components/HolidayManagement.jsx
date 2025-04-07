import { useState, useEffect } from 'react';
import '../styles/HolidayManagement.css';
import { IoArrowBack } from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';

const HolidayManagement = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHolidayForm, setShowHolidayForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [holidayForm, setHolidayForm] = useState({
    name: '',
    description: '',
    holidayDate: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setHolidayForm(prevForm => ({
      ...prevForm,
      [id]: value
    }));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/client/all', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch clients');
      setLoading(false);
    }
  };

  const fetchHolidays = async (clientName) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8081/holiday/get/${encodeURIComponent(clientName)}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch holidays');
      const data = await response.json();
      setHolidays(data);
    } catch (err) {
      setError('Failed to fetch holidays');
      setHolidays([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    fetchHolidays(client.name);
  };

  const handleBack = () => {
    setSelectedClient(null);
    setHolidays([]);
  };

  const handleAddHoliday = () => {
    setHolidayForm({
      name: '',
      description: '',
      holidayDate: ''
    });
    setEditingHoliday(null);
    setShowHolidayForm(true);
  };

  const handleEditHoliday = (holiday) => {
    setHolidayForm({
      name: holiday.name,
      description: holiday.description,
      holidayDate: holiday.holidayDate.split('T')[0] // Format date for input
    });
    setEditingHoliday(holiday);
    setShowHolidayForm(true);
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (!window.confirm('Are you sure you want to delete this holiday?')) return;

    try {
      const response = await fetch(`http://localhost:8081/holiday/delete/${holidayId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete holiday');
      
      // Refresh holidays list
      fetchHolidays(selectedClient.name);
    } catch (err) {
      setError('Failed to delete holiday');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const holidayData = {
      ...holidayForm,
      clientName: selectedClient.name
    };

    if (editingHoliday) {
      holidayData.holidayId = editingHoliday.holidayId;
    }

    try {
      const url = editingHoliday 
        ? `http://localhost:8081/holiday/update/${editingHoliday.holidayId}`
        : 'http://localhost:8081/holiday/add';
      
      const response = await fetch(url, {
        method: editingHoliday ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(holidayData)
      });

      if (!response.ok) throw new Error('Failed to save holiday');

      // Refresh holidays list
      fetchHolidays(selectedClient.name);
      setShowHolidayForm(false);
      setEditingHoliday(null);
    } catch (err) {
      setError('Failed to save holiday');
    }
  };

  const HolidayForm = () => (
    <div className="holiday-form-overlay">
      <div className="holiday-form">
        <h3>{editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name">Holiday Name</label>
            <input
              type="text"
              id="name"
              value={holidayForm.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="holidayDate">Date</label>
            <input
              type="date"
              id="holidayDate"
              value={holidayForm.holidayDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={holidayForm.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setShowHolidayForm(false)} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="holiday-management">
      <div className="content-section">
        {selectedClient ? (
          <>
            <div className="navigation-header">
              <button 
                className="back-button"
                onClick={handleBack}
              >
                <IoArrowBack className="back-icon" />
                Back to Clients
              </button>
              <div className="current-page-title">
                <h3>{selectedClient.name}</h3>
                <span className="subtitle">Holiday List</span>
              </div>
            </div>

            <div className="action-bar">
              <button className="add-holiday-btn" onClick={handleAddHoliday}>
                Add Holiday
              </button>
            </div>

            <div className="holidays-grid">
              {holidays.map(holiday => (
                <div key={holiday.holidayId} className="holiday-card">
                  <div className="holiday-details">
                    <h3>{holiday.name}</h3>
                    <p className="date">
                      {new Date(holiday.holidayDate).toLocaleDateString()}
                    </p>
                    <p className="description">{holiday.description}</p>
                  </div>
                  <div className="holiday-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditHoliday(holiday)}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteHoliday(holiday.holidayId)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {holidays.length === 0 && (
                <div className="no-holidays">
                  No holidays found for this client.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="section-header">
              <h3>Holiday Management</h3>
              <p className="section-description">Select a client to view and manage their holidays</p>
            </div>

            <div className="clients-grid">
              {clients.map(client => (
                <div
                  key={client.clientId}
                  className="client-card"
                  onClick={() => handleClientSelect(client)}
                >
                  <h3>{client.name}</h3>
                  <p className="client-details">
                    <span>SPOC: {client.spocName}</span>
                    <span>Total Holidays: {client.totalHolidays}</span>
                  </p>
                </div>
              ))}
            </div>
            {clients.length === 0 && (
              <div className="no-clients">
                No clients found.
              </div>
            )}
          </>
        )}
      </div>
      {showHolidayForm && <HolidayForm />}
    </div>
  );
};

export default HolidayManagement;




