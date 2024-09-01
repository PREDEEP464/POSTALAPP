// // src/Home.jsx
// import React from 'react';
// import MapComponent from './MapComponent';
// import './Home.css';

// function Home() {
//   return (
//     <div className="home-container">
//       <div className="content">
//         <h2>Welcome to the Postal Service Application</h2>
//         <p>This is the home page. We will add more content here in the future.</p>
//         <p>The feasibility of the AI-powered Delivery Post Office Identification System is high...</p>
//       </div>

//     </div>
//   );
// }

// export default Home;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faEnvelopesBulk, faLocationDot, faTruckFast, faBuildingUser, faPeopleCarryBox } from '@fortawesome/free-solid-svg-icons';
import ImageSlider from './ImageSlider';
import './Home.css'; // Import the CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <div className="sidebar">
        <h3 className="sidebar-title">Sidebar</h3>
        <a href="#" className="sidebar-link">About US</a>
        <a href="#" className="sidebar-link">Performance Dashboard</a>
        <a href="#" className="sidebar-link">Mails And Spams</a>
        <a href="#" className="sidebar-link">Banking & Remittance</a>
        <a href="#" className="sidebar-link">NPS</a>
        <a href="#" className="sidebar-link">Business & Ecommerce</a>
        <a href="#" className="sidebar-link">Insurance</a>
        <a href="#" className="sidebar-link">Retail Services</a>
        <a href="#" className="sidebar-link">Tools & Help</a>
      </div>
      
      <div className="main-content">
        <h2>Welcome to the Postal Service Application</h2>
        <div className="header-slider-container">
          <ImageSlider />
        </div>
        
        <div className="image-gallery">
          <div className="gallery-item">
            <FontAwesomeIcon icon={faCalculator} className="gallery-icon" />
            <p>Calculator</p>
          </div>
          <div className="gallery-item">
            <FontAwesomeIcon icon={faEnvelopesBulk} className="gallery-icon" />
            <p>Mails & Spams</p>
          </div>
          <div className="gallery-item">
            <FontAwesomeIcon icon={faLocationDot} className="gallery-icon" />
            <p>Location</p>
          </div>
          <div className="gallery-item">
            <FontAwesomeIcon icon={faTruckFast} className="gallery-icon" />
            <p>Fast Delivery</p>
          </div>
          <div className="gallery-item">
            <FontAwesomeIcon icon={faBuildingUser} className="gallery-icon" />
            <p>Corporate Services</p>
          </div>
          <div className="gallery-item">
            <FontAwesomeIcon icon={faPeopleCarryBox} className="gallery-icon" />
            <p>Logistics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;