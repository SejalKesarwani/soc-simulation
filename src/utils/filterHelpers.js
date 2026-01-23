/**
 * Filter incidents based on active filter criteria
 * @param {Array} incidents - Array of incident objects
 * @param {Object} filters - Filter criteria object
 * @param {Array} filters.attackTypes - Array of attack types to filter by
 * @param {Array} filters.severities - Array of severity levels to filter by
 * @param {Array} filters.statuses - Array of statuses to filter by
 * @param {string} filters.dateFrom - Start date for date range (ISO format)
 * @param {string} filters.dateTo - End date for date range (ISO format)
 * @param {string} filters.ipSearch - IP address search term (case-insensitive)
 * @returns {Array} Filtered array of incidents
 */
export function filterIncidents(incidents = [], filters = {}) {
  // Check if any filters are actually applied
  const hasFilters =
    (filters.attackTypes && filters.attackTypes.length > 0) ||
    (filters.severities && filters.severities.length > 0) ||
    (filters.statuses && filters.statuses.length > 0) ||
    (filters.dateFrom && filters.dateFrom.trim() !== '') ||
    (filters.dateTo && filters.dateTo.trim() !== '') ||
    (filters.ipSearch && filters.ipSearch.trim() !== '');

  // Return all incidents if no filters applied
  if (!hasFilters) {
    return incidents;
  }

  return incidents.filter((incident) => {
    // Filter by attack type
    if (filters.attackTypes && filters.attackTypes.length > 0) {
      if (!filters.attackTypes.includes(incident.attackType)) {
        return false;
      }
    }

    // Filter by severity
    if (filters.severities && filters.severities.length > 0) {
      if (!filters.severities.includes(incident.severity)) {
        return false;
      }
    }

    // Filter by status
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(incident.status)) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const incidentDate = new Date(incident.timestamp);

      if (filters.dateFrom && filters.dateFrom.trim() !== '') {
        const fromDate = new Date(filters.dateFrom);
        if (incidentDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo && filters.dateTo.trim() !== '') {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999); // Include entire end date
        if (incidentDate > toDate) {
          return false;
        }
      }
    }

    // Filter by IP address (case-insensitive)
    if (filters.ipSearch && filters.ipSearch.trim() !== '') {
      if (!incident.sourceIP.toLowerCase().includes(filters.ipSearch.toLowerCase())) {
        return false;
      }
    }

    return true;
  });
}

export default filterIncidents;
