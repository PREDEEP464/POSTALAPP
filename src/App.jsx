import React, { useState, useEffect, useRef } from 'react';
import QRious from 'qrious';
import './App.css';

function App() {
  const [postalDetails, setPostalDetails] = useState([]);
  const [qrCodeUrls, setQrCodeUrls] = useState([]);
  const qrCodeRefs = useRef([]);

  const fetchPostalDetails = async (pincode) => {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    if (data[0].Status === "Success") {
      const detailsList = data[0].PostOffice;
      setPostalDetails(detailsList);
      const urls = detailsList.map(details => 
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${details.Name},${details.District},${details.State},${details.Country}`)}`
      );
      setQrCodeUrls(urls);
    }
  };

  const handleInputChange = (e) => {
    fetchPostalDetails(e.target.value);
  };

  useEffect(() => {
    qrCodeRefs.current = qrCodeRefs.current.slice(0, postalDetails.length);
    postalDetails.forEach((_, index) => {
      if (qrCodeRefs.current[index]) {
        new QRious({
          element: qrCodeRefs.current[index],
          value: qrCodeUrls[index] || '',
          size: 256,
          background: '#ffffff',
          foreground: '#000000',
        });
      }
    });
  }, [postalDetails, qrCodeUrls]);

  return (
    <div className="app-container">
      <h1>Postal QR Code Generator</h1>
      <input 
        type="text" 
        placeholder="Enter PIN code" 
        onChange={handleInputChange} 
        className="input-field"
      />
      <div className="postal-details-container">
        {postalDetails.length > 0 ? (
          postalDetails.map((details, index) => (
            <div key={index} className="postal-details-card">
              <h3>{details.Name}</h3>
              <p><strong>District:</strong> {details.District}</p>
              <p><strong>State:</strong> {details.State}</p>
              <p><strong>Country:</strong> {details.Country}</p>
              <p><strong>PIN Code:</strong> {details.Pincode}</p>
              <canvas 
                ref={el => qrCodeRefs.current[index] = el} 
                className="qr-code-canvas"
              />
            </div>
          ))
        ) : (
          <p>No data found. Please enter a valid PIN code.</p>
        )}
      </div>
    </div>
  );
}

export default App;
