import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5001/api';

const IncidentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [incident, setIncident] = useState(null);
  const [relatedIncidents, setRelatedIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analystNotes, setAnalystNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch incident details
  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Incident not found');
        }
        throw new Error('Failed to fetch incident details');
      }
      
      const data = await response.json();
      setIncident(data);
      setAnalystNotes(data.analystNotes || '');
      
      // Fetch related incidents
      fetchRelatedIncidents(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch related incidents (same IP or type)
  const fetchRelatedIncidents = async (currentIncident) => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`);
      if (response.ok) {
        const allIncidents = await response.json();
        const related = allIncidents.filter(
          (inc) =>
            inc.id !== currentIncident.id &&
            (inc.sourceIP === currentIncident.sourceIP ||
              inc.type === currentIncident.type ||
              inc.attackType === currentIncident.attackType)
        ).slice(0, 5);
        setRelatedIncidents(related);
      }
    } catch (err) {
      console.error('Failed to fetch related incidents:', err);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [fetchIncident]);

  // Mark incident as resolved
  const handleMarkResolved = async () => {
    try {
      setActionLoading('resolve');
      const response = await fetch(`${API_BASE_URL}/incidents/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      setIncident((prev) => ({
        ...prev,
        status: 'Resolved',
        resolvedAt: new Date().toISOString(),
        timeline: [
          ...(prev.timeline || []),
          {
            timestamp: new Date().toISOString(),
            action: 'Status changed to Resolved',
            user: 'Analyst',
          },
        ],
      }));
      
      toast.success('Incident marked as resolved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Export report
  const handleExportReport = () => {
    if (!incident) return;
    
    const report = {
      reportGeneratedAt: new Date().toISOString(),
      incident: {
        ...incident,
        analystNotes,
      },
      relatedIncidents,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  // Delete incident
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
      return;
    }
    
    try {
      setActionLoading('delete');
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete incident');
      
      toast.success('Incident deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Save analyst notes
  const handleSaveNotes = async () => {
    try {
      setSavingNotes(true);
      const response = await fetch(`${API_BASE_URL}/incidents/${id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analystNotes }),
      });
      
      if (!response.ok) throw new Error('Failed to save notes');
      
      setIncident((prev) => ({ ...prev, analystNotes }));
      toast.success('Notes saved successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  // Get severity badge styles
  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300',
    };
    return styles[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Get status badge styles
  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-blue-100 text-blue-800 border-blue-300',
      'in progress': 'bg-purple-100 text-purple-800 border-purple-300',
      investigating: 'bg-purple-100 text-purple-800 border-purple-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return styles[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading incident details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center bg-gray-800 p-8 rounded-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={fetchIncident}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Toaster />
      
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>

      {/* Header */}
      <header className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">Incident #{incident.id}</h1>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadge(incident.status)}`}>
                {incident.status || 'Open'}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getSeverityBadge(incident.severity)}`}>
                {incident.severity || 'Unknown'}
              </span>
            </div>
            <h2 className="text-xl text-gray-300">{incident.title || 'Untitled Incident'}</h2>
            <p className="text-gray-500 mt-1">
              Created: {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : 'Unknown'}
              {incident.resolvedAt && (
                <span className="ml-4">
                  Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                </span>
              )}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleMarkResolved}
              disabled={actionLoading === 'resolve' || incident.status === 'Resolved'}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                incident.status === 'Resolved'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {actionLoading === 'resolve' ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>✓</span>
              )}
              Mark as Resolved
            </button>
            <button
              onClick={handleExportReport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <span>📄</span>
              Export Report
            </button>
            <button
              onClick={handleDelete}
              disabled={actionLoading === 'delete'}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {actionLoading === 'delete' ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <span>🗑️</span>
              )}
              Delete
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attack Details Card */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-500">🎯</span>
              Attack Details
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">{incident.description || 'No description available'}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Attack Type</p>
                  <p className="text-white font-medium">{incident.type || incident.attackType || 'Unknown'}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Category</p>
                  <p className="text-white font-medium">{incident.category || 'Uncategorized'}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Source</p>
                  <p className="text-white font-medium">{incident.source || 'Unknown'}</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Target</p>
                  <p className="text-white font-medium">{incident.target || 'Unknown'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Technical Details */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">💻</span>
              Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Source IP</p>
                <p className="text-white font-mono">{incident.sourceIP || incident.source_ip || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Destination IP</p>
                <p className="text-white font-mono">{incident.destIP || incident.dest_ip || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Source Port</p>
                <p className="text-white font-mono">{incident.sourcePort || incident.source_port || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Destination Port</p>
                <p className="text-white font-mono">{incident.destPort || incident.dest_port || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Protocol</p>
                <p className="text-white font-mono">{incident.protocol || 'N/A'}</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">User Agent</p>
                <p className="text-white font-mono text-sm truncate">{incident.userAgent || 'N/A'}</p>
              </div>
            </div>
            
            {/* Payload section */}
            {incident.payload && (
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Payload / Raw Data</p>
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto text-sm font-mono text-green-400">
                  {typeof incident.payload === 'object' 
                    ? JSON.stringify(incident.payload, null, 2) 
                    : incident.payload}
                </pre>
              </div>
            )}
          </section>

          {/* Mitigation Recommendations */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-500">🛡️</span>
              Mitigation Recommendations
            </h3>
            {incident.mitigations || incident.recommendations ? (
              <ul className="space-y-3">
                {(incident.mitigations || incident.recommendations || []).map((mitigation, index) => (
                  <li key={index} className="flex items-start gap-3 bg-gray-700 rounded-lg p-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-gray-300">{mitigation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="bg-gray-700 rounded-lg p-4">
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Block source IP ({incident.sourceIP || 'N/A'}) at firewall level
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Review access logs for similar patterns
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Update IDS/IPS signatures for this attack type
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Notify affected system owners
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    Document incident for compliance reporting
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Analyst Notes */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-yellow-500">📝</span>
              Analyst Notes
            </h3>
            <textarea
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              placeholder="Add your investigation notes, findings, and observations here..."
              className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {savingNotes ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    Save Notes
                  </>
                )}
              </button>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-500">📅</span>
              Timeline
            </h3>
            <div className="space-y-4">
              {/* Created event */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-600 mt-1"></div>
                </div>
                <div className="pb-4">
                  <p className="text-sm text-gray-400">
                    {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : 'Unknown'}
                  </p>
                  <p className="text-white">Incident created</p>
                </div>
              </div>
              
              {/* Dynamic timeline events */}
              {(incident.timeline || []).map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    {index < (incident.timeline?.length || 0) - 1 && (
                      <div className="w-0.5 h-full bg-gray-600 mt-1"></div>
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-400">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown'}
                    </p>
                    <p className="text-white">{event.action}</p>
                    {event.user && (
                      <p className="text-gray-500 text-sm">by {event.user}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Resolved event */}
              {incident.resolvedAt && (
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(incident.resolvedAt).toLocaleString()}
                    </p>
                    <p className="text-white">Incident resolved</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Related Incidents */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-orange-500">🔗</span>
              Related Incidents
            </h3>
            {relatedIncidents.length > 0 ? (
              <div className="space-y-3">
                {relatedIncidents.map((related) => (
                  <button
                    key={related.id}
                    onClick={() => navigate(`/incident/${related.id}`)}
                    className="w-full text-left bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">#{related.id}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityBadge(related.severity)}`}>
                        {related.severity}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate">
                      {related.title || related.description || 'No description'}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {related.sourceIP && `IP: ${related.sourceIP}`}
                      {related.type && ` • ${related.type}`}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No related incidents found</p>
            )}
          </section>

          {/* Quick Info */}
          <section className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-cyan-500">ℹ️</span>
              Quick Info
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Incident ID</span>
                <span className="text-white font-mono">{incident.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Severity</span>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityBadge(incident.severity)}`}>
                  {incident.severity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${getStatusBadge(incident.status)}`}>
                  {incident.status || 'Open'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Assigned To</span>
                <span className="text-white">{incident.assignedTo || 'Unassigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority</span>
                <span className="text-white">{incident.priority || 'Normal'}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;
