import toast from 'react-hot-toast';

// Toast configuration with dark theme
export const toastConfig = {
  // Default options for all toasts
  position: 'top-right',
  
  // Default toast options
  toastOptions: {
    // Default duration
    duration: 4000,
    
    // Default styling (dark theme)
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #374151',
      borderRadius: '8px',
      padding: '12px 16px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
    },
    
    // Success toast styling
    success: {
      duration: 4000,
      iconTheme: {
        primary: '#10b981',
        secondary: '#1f2937',
      },
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #10b981',
      },
    },
    
    // Error toast styling
    error: {
      duration: 4000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#1f2937',
      },
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #ef4444',
      },
    },
    
    // Loading toast styling
    loading: {
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#1f2937',
      },
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #3b82f6',
      },
    },
  },
};

// Custom icon components
const SuccessIcon = () => (
  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
      clipRule="evenodd"
    />
  </svg>
);

const CriticalIcon = () => (
  <svg className="w-6 h-6 text-red-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clipRule="evenodd"
    />
  </svg>
);

/**
 * Show a success toast notification
 * @param {string} message - The message to display
 * @param {object} options - Optional toast options to override defaults
 */
export const showSuccessToast = (message, options = {}) => {
  return toast.success(message, {
    duration: 4000,
    icon: <SuccessIcon />,
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #10b981',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    ...options,
  });
};

/**
 * Show an error toast notification
 * @param {string} message - The error message to display
 * @param {object} options - Optional toast options to override defaults
 */
export const showErrorToast = (message, options = {}) => {
  return toast.error(message, {
    duration: 4000,
    icon: <ErrorIcon />,
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #ef4444',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    ...options,
  });
};

/**
 * Show a warning toast notification
 * @param {string} message - The warning message to display
 * @param {object} options - Optional toast options to override defaults
 */
export const showWarningToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: <WarningIcon />,
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #f97316',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    ...options,
  });
};

/**
 * Show an info toast notification
 * @param {string} message - The info message to display
 * @param {object} options - Optional toast options to override defaults
 */
export const showInfoToast = (message, options = {}) => {
  return toast(message, {
    duration: 4000,
    icon: <InfoIcon />,
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      padding: '12px 16px',
    },
    ...options,
  });
};

/**
 * Show a critical alert toast with incident details
 * @param {object} incident - The incident object with details
 * @param {object} options - Optional toast options to override defaults
 */
export const showCriticalAlert = (incident, options = {}) => {
  const {
    id,
    title,
    description,
    type,
    attackType,
    severity,
    sourceIP,
    source_ip,
    destIP,
    dest_ip,
  } = incident;

  const incidentTitle = title || description || 'Critical Security Incident';
  const incidentType = type || attackType || 'Unknown';
  const srcIP = sourceIP || source_ip;
  const dstIP = destIP || dest_ip;

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-gray-900 shadow-lg rounded-lg pointer-events-auto border-l-4 border-red-500 overflow-hidden`}
        style={{
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
        }}
      >
        {/* Header */}
        <div className="bg-red-500/10 px-4 py-2 flex items-center gap-2 border-b border-red-500/20">
          <CriticalIcon />
          <span className="text-red-400 font-bold text-sm uppercase tracking-wide">
            Critical Alert
          </span>
          <span className="ml-auto text-xs text-gray-500">
            #{id}
          </span>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-white font-medium mb-2">
            {incidentTitle}
          </p>
          
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="text-gray-500">Type:</span>
              <span className="text-red-400 font-medium">{incidentType}</span>
            </div>
            
            {srcIP && (
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-500">Source IP:</span>
                <span className="font-mono text-yellow-400">{srcIP}</span>
              </div>
            )}
            
            {dstIP && (
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-gray-500">Target IP:</span>
                <span className="font-mono text-yellow-400">{dstIP}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                // Navigate to incident detail if needed
                if (typeof window !== 'undefined' && id) {
                  window.location.href = `/incident/${id}`;
                }
              }}
              className="flex-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded transition-colors"
            >
              View Details
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium rounded transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    ),
    {
      duration: 6000,
      position: 'top-right',
      ...options,
    }
  );
};

/**
 * Show high severity alert toast
 * @param {object} incident - The incident object with details
 * @param {object} options - Optional toast options to override defaults
 */
export const showHighSeverityAlert = (incident, options = {}) => {
  const { id, title, description, type, attackType } = incident;
  const incidentTitle = title || description || 'High Severity Incident';
  const incidentType = type || attackType || 'Unknown';

  return toast(
    (t) => (
      <div className="flex items-start gap-3">
        <WarningIcon />
        <div className="flex-1">
          <p className="text-white font-medium">
            High Severity: {incidentType}
          </p>
          <p className="text-gray-400 text-sm mt-1 truncate max-w-xs">
            {incidentTitle}
          </p>
          <p className="text-gray-500 text-xs mt-1">
            ID: #{id}
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    ),
    {
      duration: 5000,
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #f97316',
        borderRadius: '8px',
        padding: '12px 16px',
        maxWidth: '400px',
      },
      ...options,
    }
  );
};

/**
 * Show a loading toast and return the toast ID for later dismissal
 * @param {string} message - The loading message to display
 * @returns {string} - The toast ID
 */
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    style: {
      background: '#1f2937',
      color: '#f3f4f6',
      border: '1px solid #3b82f6',
      borderRadius: '8px',
      padding: '12px 16px',
    },
  });
};

/**
 * Dismiss a specific toast or all toasts
 * @param {string} toastId - Optional toast ID to dismiss. If not provided, dismisses all toasts.
 */
export const dismissToast = (toastId) => {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
};

/**
 * Update a loading toast to success or error
 * @param {string} toastId - The toast ID to update
 * @param {string} message - The new message
 * @param {string} type - 'success' or 'error'
 */
export const updateToast = (toastId, message, type = 'success') => {
  if (type === 'success') {
    toast.success(message, {
      id: toastId,
      duration: 4000,
      icon: <SuccessIcon />,
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #10b981',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  } else {
    toast.error(message, {
      id: toastId,
      duration: 4000,
      icon: <ErrorIcon />,
      style: {
        background: '#1f2937',
        color: '#f3f4f6',
        border: '1px solid #ef4444',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    });
  }
};

export default {
  toastConfig,
  showSuccessToast,
  showErrorToast,
  showWarningToast,
  showInfoToast,
  showCriticalAlert,
  showHighSeverityAlert,
  showLoadingToast,
  dismissToast,
  updateToast,
};
