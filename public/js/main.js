// main.js
document.addEventListener('DOMContentLoaded', () => {
  const apiLogDiv = document.getElementById('api-log');
  const dataOutputDiv = document.getElementById('data-output');

  // Log API call activity
  function logApiCall(endpoint, method, status) {
      const logEntry = document.createElement('div');
      logEntry.textContent = `${method} ${endpoint} - Status: ${status}`;
      apiLogDiv.appendChild(logEntry);
  }

  // Fetch data from JBAPP endpoints
  async function fetchData(endpoint) {
      try {
          const response = await fetch(endpoint);
          const data = await response.json();
          logApiCall(endpoint, 'GET', response.status);
          dataOutputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      } catch (error) {
          logApiCall(endpoint, 'GET', 'Error');
          console.error('Error fetching data:', error);
      }
  }

  // Example: Monitor users and jobs
  fetchData('/api/users');
  fetchData('/api/jobs');
});
