import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalculator,
  faEnvelopesBulk,
  faLocationDot,
  faTruckFast,
  faBuildingUser,
  faPeopleCarryBox,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import ImageSlider from './ImageSlider';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [activeTab, setActiveTab] = useState('news');
  const navigate = useNavigate(); // Hook to navigate between routes

  const updates = {
    news: [
      {
        date: '24Aug',
        title: 'Outsourcing of Manpower for delivery of Postal Articles at Lucknow Division',
        size: '[89 KB]',
      },
      {
        date: '23Aug',
        title: 'Online Tender for outsourcing of manpower for delivery of articles and other works at Lucknow GPO',
        size: '[90 KB]',
      },
      {
        date: '25Jul',
        title: 'Tender for Modernization, Upgradation, Expansion of National Philatelic Museum',
        size: '[2013 KB]',
      },
    ],
    tenders: [
      {
        date: '24Aug',
        title: 'Curation and Preparation of Detailed Project Report (DPR) along with estimates(BOQ) with technical specifications for Modernization, Upgradation, Expansion of National Philatelic Museum into a National Postal Museum',
        size: '[89 KB]',
      },
      {
        date: '23Aug',
        title: 'Outsourcing of Manpower for delivery of Postal Articles at Lucknow Division',
        size: '[90 KB]',
      },
      {
        date: '25Jul',
        title: 'Tender for Modernization, Upgradation, Expansion of National Philatelic Museum',
        size: '[2013 KB]',
      },
    ],
    notifications: [
      {
        date: '24Aug',
        title: 'DOP contact centre service provider RFP',
        size: '[89 KB]',
      },
      {
        date: '23Aug',
        title: 'Online Tender for outsourcing of manpower for delivery of articles and other works at Lucknow GPO',
        size: '[90 KB]',
      },
      {
        date: '25Jul',
        title: 'Tender for Modernization, Upgradation, Expansion of National Philatelic Museum',
        size: '[2013 KB]',
      },
    ],
    recruitment: [
      {
        date: '24Aug',
        title: 'Outsourcing of Manpower for delivery of Postal Articles at Lucknow Division',
        size: '[89 KB]',
      },
      {
        date: '23Aug',
        title: 'Online Tender for outsourcing of manpower for delivery of articles and other works at Lucknow GPO',
        size: '[90 KB]',
      },
      {
        date: '25Jul',
        title: 'Tender for Modernization, Upgradation, Expansion of National Philatelic Museum',
        size: '[2013 KB]',
      },
    ],
  };

  const handleGalleryItemClick = (route) => {
    navigate(route); // Navigate to the specified route
  };

  return (
    <div className="home-container">
      <div className="sidebar">
        <h3 className="sidebar-title">EXPLORE</h3>
        <a href="#" className="sidebar-link">About Us</a>
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
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/calculator')}>
            <FontAwesomeIcon icon={faCalculator} className="gallery-icon" />
            <p>Calculator</p>
          </div>
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/address-validator')}>
            <FontAwesomeIcon icon={faEnvelopesBulk} className="gallery-icon" />
            <p>Address Pincode Validator</p>
          </div>
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/map')}>
            <FontAwesomeIcon icon={faLocationDot} className="gallery-icon" />
            <p>Map</p>
          </div>
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/order-tracking')}>
            <FontAwesomeIcon icon={faTruckFast} className="gallery-icon" />
            <p>Order Tracking</p>
          </div>
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/corporate-services')}>
            <FontAwesomeIcon icon={faBuildingUser} className="gallery-icon" />
            <p>Corporate Services</p>
          </div>
          <div className="gallery-item" onClick={() => handleGalleryItemClick('/logistics')}>
            <FontAwesomeIcon icon={faPeopleCarryBox} className="gallery-icon" />
            <p>Logistics</p>
          </div>
        </div>

        <div className="update-section">
          <div className="update-tabs">
            <button
              className={`update-tab ${activeTab === 'news' ? 'active' : ''}`}
              onClick={() => setActiveTab('news')}
            >
              News & Updates
            </button>
            <button
              className={`update-tab ${activeTab === 'tenders' ? 'active' : ''}`}
              onClick={() => setActiveTab('tenders')}
            >
              Tenders
            </button>
            <button
              className={`update-tab ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button
              className={`update-tab ${activeTab === 'recruitment' ? 'active' : ''}`}
              onClick={() => setActiveTab('recruitment')}
            >
              Recruitment
            </button>
          </div>

          <div className="update-list">
            {updates[activeTab].map((update, index) => (
              <div key={index} className="update-item">
                <span className="update-date">{update.date}</span> <span className="new-tag">New</span>
                <a href="#" className="update-link">
                <FontAwesomeIcon icon={faFilePdf} style={{color: "#ec0914",}} className="pdf-icon" /> {update.title}
                </a>
                <span className="file-size">{update.size}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="about-us" className="about-us-section">
          <h2>About Us</h2>
          <p>
            For more than 150 years, the Department of Posts (DoP) has been the backbone of the country’s communication
            and has played a crucial role in the country’s social economic development. It touches the lives of Indian
            citizens in many ways: delivering mails, accepting deposits under Small Savings Schemes, providing life
            insurance cover under Postal Life Insurance (PLI) and Rural Postal Life Insurance (RPLI) and providing
            retail services like bill collection, sale of forms, etc. The DoP also acts as an agent for Government of
            India in discharging other services for citizens such as Mahatma Gandhi National Rural Employment
            Guarantee Scheme (MGNREGS) wage disbursement and old age pension payments. With more than 1,55,000 post
            offices, the DoP has the most widely distributed postal network in the world.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
