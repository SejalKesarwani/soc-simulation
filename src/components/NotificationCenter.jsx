import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'soc_notifications';
const MAX_NOTIFICATIONS = 20;

// Helper function to format relative time
const getRelativeTime = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString();
};

// Get icon based on severity
const getSeverityIcon = (severity) => {
  const severityLower = severity?.toLowerCase();
  
  switch (severityLower) {
    case 'critical':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'high':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'medium':
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      );
    case 'low':
    default:
      return (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
      );
  }
};

// Get severity text color
const getSeverityTextColor = (severity) => {
  const colors = {
    critical: 'text-red-400',
    high: 'text-orange-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };
  return colors[severity?.toLowerCase()] || 'text-gray-400';
};

const NotificationCenter = ({ 
  notifications: externalNotifications = [], 
  onMarkRead, 
  onClearAll 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (e) {
        console.error('Failed to parse stored notifications:', e);
        setNotifications([]);
      }
    }
  }, []);

  // Update notifications when external notifications change
  useEffect(() => {
    if (externalNotifications.length > 0) {
      setNotifications((prev) => {
        // Merge new notifications with existing ones, avoiding duplicates
        const existingIds = new Set(prev.map((n) => n.id));
        const newNotifications = externalNotifications.filter(
          (n) => !existingIds.has(n.id)
        );
        
        if (newNotifications.length === 0) return prev;

        // Add isRead property to new notifications
        const processedNew = newNotifications.map((n) => ({
          ...n,
          isRead: n.isRead ?? false,
          timestamp: n.timestamp || new Date().toISOString(),
        }));

        // Combine and limit to MAX_NOTIFICATIONS
        const combined = [...processedNew, ...prev].slice(0, MAX_NOTIFICATIONS);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        
        return combined;
      });
    }
  }, [externalNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark notification as read
  const handleMarkRead = useCallback((notificationId) => {
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Call external callback if provided
    if (onMarkRead && typeof onMarkRead === 'function') {
      onMarkRead(notificationId);
    }
  }, [onMarkRead]);

  // Clear all notifications
  const handleClearAll = useCallback(() => {
    setNotifications([]);
    localStorage.removeItem(STORAGE_KEY);
    setIsOpen(false);

    // Call external callback if provided
    if (onClearAll && typeof onClearAll === 'function') {
      onClearAll();
    }
  }, [onClearAll]);

  // Mark all as read
  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, isRead: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-750 border-b border-gray-700">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-500 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-gray-500 text-sm mt-1">
                  Incidents will appear here as they occur
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-700">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                      !notification.isRead ? 'bg-blue-500/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Severity Icon */}
                      {getSeverityIcon(notification.severity)}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            <span className={getSeverityTextColor(notification.severity)}>
                              [{notification.severity}]
                            </span>{' '}
                            {notification.type || notification.attackType || 'Incident'}
                          </p>
                          {!notification.isRead && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-400 mt-0.5">
                          ID: #{notification.id}
                        </p>
                        
                        {notification.title && (
                          <p className="text-sm text-gray-300 mt-1 truncate">
                            {notification.title}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {getRelativeTime(notification.timestamp)}
                          </span>
                          
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkRead(notification.id);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 bg-gray-750 border-t border-gray-700">
              <button
                onClick={handleClearAll}
                className="w-full py-2 px-4 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Custom styles for bg-gray-750 */}
      <style jsx>{`
        .bg-gray-750 {
          background-color: #374151;
        }
      `}</style>
    </div>
  );
};

export default NotificationCenter;
