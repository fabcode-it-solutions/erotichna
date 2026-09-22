import { useState, useEffect, useCallback } from 'react';

export function useCSRF() {
  const [csrfToken, setCSRFToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCSRFToken = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.csrfToken) {
        throw new Error('No CSRF token received from server');
      }
      
      setCSRFToken(data.csrfToken);
    } catch (err) {
      console.error('Failed to fetch CSRF token:', err);
      setError(err.message);
      setCSRFToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCSRFToken();
  }, [fetchCSRFToken]);

  const getHeaders = useCallback((additionalHeaders = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...additionalHeaders
    };
    
    // Only add CSRF token if we have one
    if (csrfToken) {
      headers['x-csrf-token'] = csrfToken;
    }
    
    return headers;
  }, [csrfToken]);

  const isReady = !loading && !error && csrfToken;

  return { 
    csrfToken, 
    loading, 
    error,
    isReady,
    getHeaders,
    refetch: fetchCSRFToken
  };
}