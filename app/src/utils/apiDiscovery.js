// API Port Discovery Utility
// Reads the actual API port from the port info file

export async function getApiBaseUrl() {
  const defaultUrl = 'http://localhost:3000';
  
  try {
    // Try to read the port info file
    const response = await fetch('/.api-port');
    if (response.ok) {
      const portInfo = await response.json();
      return portInfo.url;
    }
  } catch (error) {
    // Fallback: try common ports
    const commonPorts = [3000, 3001, 3002];
    
    for (const port of commonPorts) {
      try {
        const testUrl = `http://localhost:${port}/api/health`;
        const healthResponse = await fetch(testUrl, { 
          method: 'GET',
          timeout: 1000 
        });
        
        if (healthResponse.ok) {
          console.log(`✅ Found API on port ${port}`);
          return `http://localhost:${port}`;
        }
      } catch (e) {
        // Continue to next port
      }
    }
  }
  
  console.warn('⚠️ Could not discover API port, using default:', defaultUrl);
  return defaultUrl;
}

// Cached API base URL
let cachedApiUrl = null;

export async function getApiUrl() {
  if (!cachedApiUrl) {
    cachedApiUrl = await getApiBaseUrl();
  }
  return cachedApiUrl;
}
