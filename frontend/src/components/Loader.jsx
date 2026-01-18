import React from 'react';
import { GraduationCap, Loader2 } from 'lucide-react';
import './Loader.css';

const Loader = ({ message = 'Study Assistant is loading...' }) => {
  return (
    <div className="loader-container" role="status">
      <div className="loader-content" style={{ textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
          <GraduationCap size={48} color="#3b82f6" />
          <Loader2 
            size={64} 
            color="#3b82f6" 
            className="animate-spin" 
            style={{ 
              position: 'absolute', 
              top: '-8px', 
              left: '-8px', 
              opacity: 0.3 
            }} 
          />
        </div>
        <div className="loader-text" style={{ color: '#64748b', fontWeight: '500' }}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default Loader;
