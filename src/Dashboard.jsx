import React, { useState, useCallback, useRef } from 'react';
import useSocket from './hooks/useSocket';
import { 
  showCriticalAlert, 
  showHighSeverityAlert, 
  showInfoToast 
} from './utils/toastConfig';

// Optional: Sound notification for critical threats
const playAlertSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, 200);
  } catch (error) {
    console.warn('Could not play alert sound:', error);
  }
};

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const incidentCountRef = useRef(0);

  // Handle new incident from WebSocket
  const handleNewIncident = useCallback((incident) => {
    setIncidents((prevIncidents) => {
      const newIncidents = [incident, ...prevIncidents];
      incidentCountRef.current = newIncidents.length;
      return newIncidents;
    });

    // Show toast notification based on severity
    if (incident.severity === 'Critical' || incident.severity === 'critical') {
      showCriticalAlert(incident);
      
      // Play alert sound for critical threats
      playAlertSound();
    } else if (incident.severity === 'High' || incident.severity === 'high') {
      showHighSeverityAlert(incident);
    } else {
      showInfoToast(incident.title || incident.description || 'New incident reported');
    }
  }, []);

  // Connect to WebSocket
  const { isConnected, connectionError } = useSocket(handleNewIncident);

  // Get severity color
  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500',
    };
    return colors[severity?.toLowerCase()] || 'bg-gray-500';
  };

  // Get severity badge style
  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return styles[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Count incidents by severity
  const incidentCounts = incidents.reduce(
    (acc, incident) => {
      const severity = incident.severity?.toLowerCase() || 'unknown';
      acc[severity] = (acc[severity] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0, total: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">SOC Dashboard</h1>
          
          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg">
              <div className={`relative w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                {isConnected && (
                  <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
                )}
              </div>
              <span className="text-sm">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
            {connectionError && (
              <span className="text-red-400 text-sm">{connectionError}</span>
            )}
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
          <h3 className="text-gray-400 text-sm">Total Incidents</h3>
          <p className="text-3xl font-bold">{incidentCounts.total}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-red-600">
          <h3 className="text-gray-400 text-sm">Critical</h3>
          <p className="text-3xl font-bold text-red-500">{incidentCounts.critical}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-orange-500">
          <h3 className="text-gray-400 text-sm">High</h3>
          <p className="text-3xl font-bold text-orange-500">{incidentCounts.high}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-yellow-500">
          <h3 className="text-gray-400 text-sm">Medium</h3>
          <p className="text-3xl font-bold text-yellow-500">{incidentCounts.medium}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="text-gray-400 text-sm">Low</h3>
          <p className="text-3xl font-bold text-green-500">{incidentCounts.low}</p>
        </div>
      </div>

      {/* Incidents List */}
      <div className="bg-gray-800 rounded-lg">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Live Incidents Feed</h2>
        </div>
        
        {incidents.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <p>No incidents yet. Waiting for live data...</p>
            {isConnected && (
              <p className="text-sm mt-2">Connected and listening for incidents</p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-700 max-h-[500px] overflow-y-auto">
            {incidents.map((incident, index) => (
              <div
                key={incident.id || index}
                className="p-4 hover:bg-gray-750 transition-colors animate-fadeIn"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityBadge(
                          incident.severity
                        )}`}
                      >
                        {incident.severity || 'Unknown'}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {incident.timestamp
                          ? new Date(incident.timestamp).toLocaleString()
                          : 'Just now'}
                      </span>
                    </div>
                    <h3 className="font-medium text-lg">
                      {incident.title || 'Untitled Incident'}
                    </h3>
                    <p className="text-gray-400 mt-1">
                      {incident.description || 'No description available'}
                    </p>
                    {incident.source && (
                      <p className="text-gray-500 text-sm mt-2">
                        Source: {incident.source}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${getSeverityColor(
                      incident.severity
                    )}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .bg-gray-750 {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
