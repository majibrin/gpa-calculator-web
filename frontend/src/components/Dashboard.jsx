import React from 'react';
import Header from './Header';
import GpaCalculator from './GpaCalculator';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Header />
      <main className="dashboard-main-content">
        <GpaCalculator />
      </main>
    </div>
  );
};

export default Dashboard;
