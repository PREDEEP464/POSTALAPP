// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Pincode from './Pincode';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Postal Service Application</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/pincode">Pincode</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pincode" element={<Pincode />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2024 Postal Service Application. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
