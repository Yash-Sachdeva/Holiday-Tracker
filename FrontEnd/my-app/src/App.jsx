import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <h1>Holiday Tracker</h1>
        </div>
        <nav className="nav-buttons">
          <button className="login-btn hr">HR Login</button>
          <button className="login-btn employee">Employee Login</button>
        </nav>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <h2>Streamline Holiday Management</h2>
          <p>Efficiently manage and track employee holidays across multiple clients</p>
        </section>

        <section className="features-grid">
          <div className="feature-card">
            <h3>Holiday Tracking</h3>
            <p>Track and manage employee leaves with ease</p>
          </div>
          <div className="feature-card">
            <h3>Client Management</h3>
            <p>Organize holidays by client and departments</p>
          </div>
          <div className="feature-card">
            <h3>Analytics</h3>
            <p>Get insights on leave patterns and availability</p>
          </div>
          <div className="feature-card">
            <h3>Calendar View</h3>
            <p>Visual calendar for better planning</p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© 2024 Holiday Tracker - All rights reserved</p>
      </footer>
    </div>
  )
}

export default App

