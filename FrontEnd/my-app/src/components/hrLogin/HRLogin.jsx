import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HRLogin.css';

const HRLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8080/auth/login/hr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.text();
        if (data === "Login successful!") {
          navigate('/hr-dashboard'); // Navigate to HR dashboard after successful login
        } else {
          setError(data);
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h2>HR Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default HRLogin;
