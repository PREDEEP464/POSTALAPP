// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Pincode from './Pincode';
import MapComponent from './MapComponent';
import CalculatePostage from './Calculator';
import AddressValidator from './AddressValidator';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Router>
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <h1>Postal Service Application</h1>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <Link to="/">Home</Link>
            <Link to="/pincode">Pincode</Link>
            <Link to="/map">Map</Link>
          </nav>

          {/* Mobile Hamburger Icon */}
          <button
            className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          {/* Mobile Navigation */}
          <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
              <li><Link to="/pincode" onClick={() => setIsMenuOpen(false)}>Pincode</Link></li>
              <li><Link to="/map" onClick={() => setIsMenuOpen(false)}>Map</Link></li>
            </ul>
          </nav>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pincode" element={<Pincode />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/calculator" element={<CalculatePostage />} />
            <Route path="/address-validator" element={<AddressValidator />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>&copy; 2024 Postal Service Application. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
