import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard';
import IncidentDetail from './IncidentDetail';
import { toastConfig } from './utils/toastConfig';

const App = () => {
  return (
    <Router>
      {/* Global Toast Container */}
      <Toaster
        position={toastConfig.position}
        toastOptions={toastConfig.toastOptions}
        containerStyle={{
          top: 20,
          right: 20,
        }}
        gutter={12}
      />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/incident/:id" element={<IncidentDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
