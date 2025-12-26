// src/components/Loader.jsx
import React from 'react';
import './Loader.css';

const Loader = ({ 
  message = 'Loading...', 
  variant = 'default', // 'default', 'spinner', 'dots', 'skeleton', 'progress'
  size = 'medium', // 'small', 'medium', 'large'
  fullScreen = true,
  className = ''
}) => {
  const containerClass = `loader-container ${fullScreen ? 'loader-overlay' : ''} ${className}`;
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <div className="loader-spinner" aria-label="Loading" />;
      
      case 'dots':
        return (
          <div className="dot-loader" aria-label="Loading">
            <div />
            <div />
            <div />
          </div>
        );
      
      case 'skeleton':
        return <div className="skeleton-loader" style={{ height: '2rem' }} aria-label="Loading" />;
      
      case 'progress':
        return <div className="progress-loader" aria-label="Loading" />;
      
      case 'default':
      default:
        return (
          <img 
            src="/assets/loader.png" // or your loader image
            alt="Loading..." 
            className={`loader-image ${size === 'small' ? 'loader-small' : ''}`}
          />
        );
    }
  };

  return (
    <div 
      className={containerClass}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {renderLoader()}
      {message && (
        <span className={`loader-text ${size === 'small' ? 'loader-small' : ''}`}>
          {message}
        </span>
      )}
    </div>
  );
};

export default Loader;
