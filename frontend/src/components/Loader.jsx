import React from 'react';
import { Loader2 } from 'lucide-react';
import './Loader.css';

const Loader = ({ size = 40, message = "Loading..." }) => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <Loader2 
          className="spinner-icon" 
          size={size} 
          strokeWidth={2.5} 
        />
        {message && <p className="loader-text">{message}</p>}
      </div>
    </div>
  );
};

export default Loader;
