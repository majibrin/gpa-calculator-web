// src/components/Loader.jsx
import React from 'react';
import loaderImg from '../assets/loader.png';
import './Loader.css';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="loader-container">
      <img src={loaderImg} alt="Loading..." className="loader-image" />
      <span className="loader-text">{message}</span>
    </div>
  );
};

export default Loader;
