import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

const API_BASE_URL = 'http://localhost:5001/api';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Search function
  const performSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setNoResults(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);

    try {
      // Fetch all incidents and filter client-side
      // In production, you'd want a dedicated search endpoint
      const response = await fetch(`${API_BASE_URL}/incidents`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch incidents');
      }

      const incidents = await response.json();
      const searchLower = searchQuery.toLowerCase().trim();

      // Filter by incident ID, IP address, or attack type
      const filtered = incidents.filter((incident) => {
        const idMatch = incident.id?.toString().includes(searchLower);
        const ipMatch = 
          incident.sourceIP?.toLowerCase().includes(searchLower) ||
          incident.source_ip?.toLowerCase().includes(searchLower) ||
          incident.destIP?.toLowerCase().includes(searchLower) ||
          incident.dest_ip?.toLowerCase().includes(searchLower);
        const typeMatch = 
          incident.type?.toLowerCase().includes(searchLower) ||
          incident.attackType?.toLowerCase().includes(searchLower) ||
          incident.category?.toLowerCase().includes(searchLower);
        const titleMatch = incident.title?.toLowerCase().includes(searchLower);
        
        return idMatch || ipMatch || typeMatch || titleMatch;
      });

      // Get last 5 matching results
      const limitedResults = filtered.slice(0, 5);
      
      setResults(limitedResults);
      setNoResults(limitedResults.length === 0);
      setIsOpen(true);

      // Call onSearch callback if provided
      if (onSearch && typeof onSearch === 'function') {
        onSearch(searchQuery, limitedResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search (300ms delay)
  const debouncedSearch = useCallback(
    debounce((searchQuery) => {
      performSearch(searchQuery);
    }, 300),
    []
  );

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Handle result click - navigate to incident detail
  const handleResultClick = (incident) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/incident/${incident.id}`);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
    if (e.key === 'Enter' && results.length > 0) {
      handleResultClick(results[0]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Get severity badge styles
  const getSeverityBadge = (severity) => {
    const styles = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return styles[severity?.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  // Highlight matching text
  const highlightMatch = (text, query) => {
    if (!text || !query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-500/30 text-yellow-300 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search by ID, IP, or attack type..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              setNoResults(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          {/* Results List */}
          {results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((incident) => (
                <li key={incident.id}>
                  <button
                    onClick={() => handleResultClick(incident)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">
                        #{highlightMatch(incident.id?.toString(), query)}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full border ${getSeverityBadge(
                          incident.severity
                        )}`}
                      >
                        {incident.severity}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate">
                      {highlightMatch(incident.title || incident.description || 'No description', query)}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      {(incident.sourceIP || incident.source_ip) && (
                        <span className="flex items-center gap-1">
                          <span>IP:</span>
                          <span className="font-mono">
                            {highlightMatch(incident.sourceIP || incident.source_ip, query)}
                          </span>
                        </span>
                      )}
                      {(incident.type || incident.attackType) && (
                        <span className="flex items-center gap-1">
                          <span>Type:</span>
                          <span>
                            {highlightMatch(incident.type || incident.attackType, query)}
                          </span>
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* No Results */}
          {noResults && !isLoading && (
            <div className="px-4 py-6 text-center">
              <svg
                className="mx-auto h-10 w-10 text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-400">No results found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try searching by incident ID, IP address, or attack type
              </p>
            </div>
          )}

          {/* Search Hint */}
          {results.length > 0 && (
            <div className="px-4 py-2 bg-gray-750 border-t border-gray-700 text-xs text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Enter</kbd> to select first result or <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-gray-400">Esc</kbd> to close
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
