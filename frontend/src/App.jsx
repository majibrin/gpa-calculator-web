import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  const handleAuthSuccess = (user, token) => {
    console.log('Logged in user:', user, 'Token:', token);
    // Save token in localStorage if you want
    localStorage.setItem('thinkora_token', token);
    localStorage.setItem('thinkora_user', JSON.stringify(user));
    // Redirect to dashboard
    window.location.href = '/';
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<AuthForm onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
