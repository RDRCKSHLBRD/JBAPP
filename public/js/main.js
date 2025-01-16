document.addEventListener('DOMContentLoaded', () => {
    const apiLogDiv = document.getElementById('api-log');
    const dataOutputDiv = document.getElementById('data-output');
    const responseElement = document.getElementById('response');
  
    // Log API call activity
    function logApiCall(endpoint, method, status) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `${method} ${endpoint} - Status: ${status}`;
        apiLogDiv.appendChild(logEntry);
    }
  
    // Ping JBAPP server
    document.getElementById('refresh-button').addEventListener('click', async () => {
        try {
            const response = await fetch('/api/ping'); // Adjust to the correct JBAPP server endpoint
            const data = await response.json();
            responseElement.innerText = `Server Response: ${data.message}`;
            logApiCall('/api/ping', 'GET', response.status);
        } catch (error) {
            responseElement.innerText = `Error: ${error.message}`;
            logApiCall('/api/ping', 'GET', 'Error');
            console.error('Error pinging the server:', error);
        }
    });
  
    // Fetch data from JBAPP endpoints
    async function fetchData(endpoint) {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            logApiCall(endpoint, 'GET', response.status);
            dataOutputDiv.innerHTML += `<h3>Data from ${endpoint}</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
        } catch (error) {
            logApiCall(endpoint, 'GET', 'Error');
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    }
  
    // Example: Monitor users and jobs
    fetchData('/api/users');
    fetchData('/api/jobs');
  });
