import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import HRLogin from './components/hrLogin/HRLogin';
import EmpLogin from './components/empLogin/EmpLogin';

// Create a separate component for the home page content
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <h1>Holiday Tracker</h1>
        </div>
        <nav className="nav-buttons">
          <button onClick={() => navigate('/hr-login')} className="login-btn hr">HR Login</button>
          <button onClick={() => navigate('/employee-login')} className="login-btn employee">Employee Login</button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2>Streamline Holiday Management</h2>
          <p>Transform your organization's leave management with our intuitive and powerful holiday tracking system</p>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Companies Trust Us</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">99.9%</div>
            <div className="stat-label">System Uptime</div>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <h3>Smart Leave Tracking</h3>
            <p>Automated tracking system with real-time updates and intelligent leave balance management</p>
          </div>
          <div className="feature-card">
            <h3>Multi-Client Management</h3>
            <p>Efficiently manage holidays across multiple clients and departments with customizable policies</p>
          </div>
          <div className="feature-card">
            <h3>Advanced Analytics</h3>
            <p>Comprehensive insights into leave patterns, availability, and resource planning</p>
          </div>
          <div className="feature-card">
            <h3>Interactive Calendar</h3>
            <p>Visual calendar interface for easy scheduling and conflict prevention</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 Holiday Tracker - Simplifying Leave Management</p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hr-login" element={<HRLogin />} />
        <Route path="/employee-login" element={<EmpLogin />} />
      </Routes>
    </Router>
  );
}

export default App;



