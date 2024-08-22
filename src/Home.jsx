// src/Home.jsx
import React from 'react';
import postalLogo from './assets/postal_logo-removebg-preview.png'; // Import the image correctly
import './Home.css'; // Import the CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <div className="content">
        <h2>Welcome to the Postal Service Application</h2>
        <p>This is the home page. We will add more content here in the future.</p>
        <p>   The feasibility of the AI-powered Delivery Post Office Identification System is high, given the availability of mature technologies like React and Auth0 that can handle address verification. The system's viability is strong, as it addresses a critical need in India Post's vast and evolving network, reducing delays and improving delivery accuracy. With scalable architecture and integration with existing infrastructure, the solution is both practical and sustainable for long-term use.
        </p>
      </div>
      <img src={postalLogo} alt="Postal Logo" className="postal-logo" />
    </div>
  );
}

export default Home;
