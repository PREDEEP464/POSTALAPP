// // ImageSlider.jsx
// import React, { useState } from 'react';
// import './ImageSlider.css'; // Create a CSS file for slider styles

// // Import images from the assets folder
// import image1 from './assets/b2.jpg';
// import image2 from './assets/india-post-payments-bank.png';
// import image3 from './assets/FC_image_750.jpg'; 
// // Add more images as needed

// const images = [image1, image2, image3]; // Add your images here

// function ImageSlider() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const nextSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   return (
//     <div className="slider-container">
//       <button className="arrow left-arrow" onClick={prevSlide}>❮</button>
//       <div className="slider">
//         <img src={images[currentIndex]} alt="Slide" className="slide-image" />
//       </div>
//       <button className="arrow right-arrow" onClick={nextSlide}>❯</button>
//     </div>
//   );
// }

// export default ImageSlider;


import React, { useState, useEffect } from 'react';
import './ImageSlider.css';

// Import images from the assets folder
import image1 from './assets/b2.jpg';
import image2 from './assets/india-post-payments-bank.png';
import image3 from './assets/FC_image_750.jpg';
// Add more images as needed

const images = [image1, image2, image3];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Automatically change the slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="slider-container">
      <div className="slider" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="slide">
            <img src={image} alt={`Slide ${index}`} className="slide-image" />
          </div>
        ))}
      </div>
      <button className="arrow left-arrow" onClick={prevSlide}>❮</button>
      <button className="arrow right-arrow" onClick={nextSlide}>❯</button>
    </div>
  );
}

export default ImageSlider;
