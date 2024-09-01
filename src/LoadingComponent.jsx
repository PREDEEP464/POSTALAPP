// LoadingComponent.jsx
import React from 'react';

function LoadingComponent() {
  return (
    <div style={{ 
      position: 'absolute', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
      zIndex: 1000 
    }}>
      <div>Loading...</div>
    </div>
  );
}

export default LoadingComponent;
