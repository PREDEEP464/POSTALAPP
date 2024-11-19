import React, { useState } from 'react';
import './Calculator.css';

function CalculatePostage() {
  const [formData, setFormData] = useState({
    fromPincode: '',
    fromCity: '',
    fromState: '',
    toPincode: '',
    toCity: '',
    toState: '',
    itemType: '',
    weight: '',
    length: '',
    width: '',
    height: '',
  });

  const [availableServices, setAvailableServices] = useState([]);
  const [error, setError] = useState('');

  const services = [
    { name: 'Business Parcel', deliveryTime: '3-5 Days', ratePerKg: 50 },
    { name: 'Parcel', deliveryTime: '3-5 Days', ratePerKg: 40 },
    { name: 'Speed Post', deliveryTime: '1-4 Days', ratePerKg: 100 },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // Clear error on input change
  };

  const calculateServices = () => {
    // Input validation
    const { weight, length, width, height, itemType } = formData;
    if (!itemType || !weight || !length || !width || !height) {
      setError('Please fill all article details!');
      return;
    }

    const weightInKg = parseFloat(weight) / 1000; // Convert grams to kilograms
    if (isNaN(weightInKg) || weightInKg <= 0) {
      setError('Invalid weight entered!');
      return;
    }

    // Calculate available services
    const calculatedServices = services.map((service) => ({
      ...service,
      cost: (weightInKg * service.ratePerKg).toFixed(2), // Calculate cost
    }));

    setAvailableServices(calculatedServices);
  };

  return (
    <div className="calculate-postage">
      <h2>Calculate Postage</h2>
      <form>
        <div className="service-type">
          <label>Type of Service:</label>
          <div>
            <input type="radio" name="service" value="domestic" id="domestic" defaultChecked />
            <label htmlFor="domestic">Domestic</label>
            <input type="radio" name="service" value="international" id="international" />
            <label htmlFor="international">International</label>
            <input type="radio" name="service" value="miscellaneous" id="miscellaneous" />
            <label htmlFor="miscellaneous">Miscellaneous</label>
          </div>
        </div>

        <div className="address-section">
          <h4>Send From</h4>
          <input
            type="text"
            placeholder="Pincode"
            name="fromPincode"
            value={formData.fromPincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="City / District"
            name="fromCity"
            value={formData.fromCity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="State / Union Territory"
            name="fromState"
            value={formData.fromState}
            onChange={handleChange}
            required
          />

          <h4>Send To</h4>
          <input
            type="text"
            placeholder="Pincode"
            name="toPincode"
            value={formData.toPincode}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="City / District"
            name="toCity"
            value={formData.toCity}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="State / Union Territory"
            name="toState"
            value={formData.toState}
            onChange={handleChange}
            required
          />
        </div>

        <div className="article-details">
          <h4>Article Details</h4>
          <select
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select an Item --</option>
            <option value="letter">Letter</option>
            <option value="parcel">Parcel</option>
            <option value="document">Document</option>
          </select>
          <div className="dimensions">
            <input
              type="number"
              placeholder="Weight (in gms)"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Length (in cm)"
              name="length"
              value={formData.length}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Width (in cm)"
              name="width"
              value={formData.width}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Height (in cm)"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="button" className="submit-btn" onClick={calculateServices}>
          Get Available Services
        </button>
      </form>

      {availableServices.length > 0 && (
        <div className="available-services">
          <h3>Available Services</h3>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Delivery Time</th>
                <th>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {availableServices.map((service, index) => (
                <tr key={index}>
                  <td>{service.name}</td>
                  <td>{service.deliveryTime}</td>
                  <td>{service.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CalculatePostage;
