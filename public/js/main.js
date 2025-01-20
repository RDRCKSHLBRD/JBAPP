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

    // Handle password login
    const passwordInput = document.getElementById('password');
    const submitPasswordButton = document.getElementById('submit-password');
    if (passwordInput && submitPasswordButton) {
        submitPasswordButton.addEventListener('click', async () => {
            const password = passwordInput.value.trim();
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password }),
                });
                const result = await response.json();
                if (response.ok) {
                    location.href = result.redirect; // Redirect to the dashboard after successful login
                } else {
                    alert('Invalid password. Please try again.');
                }
            } catch (error) {
                console.error('Error during password submission:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Ping JBAPP server
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/ping');
                const data = await response.json();
                responseElement.innerText = `Server Response: ${data.message}`;
                logApiCall('/api/ping', 'GET', response.status);
            } catch (error) {
                responseElement.innerText = `Error: ${error.message}`;
                logApiCall('/api/ping', 'GET', 'Error');
                console.error('Error pinging the server:', error);
            }
        });
    }

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

    // Fetch dynamic database tables
    async function fetchTables() {
        try {
            const response = await fetch('/api/tables');
            const tableData = await response.json();
            const tableDisplay = document.getElementById('table-display');
            tableDisplay.innerHTML = ''; // Clear existing data

            for (const [tableName, rows] of Object.entries(tableData)) {
                tableDisplay.innerHTML += `<h3>Table: ${tableName}</h3><pre>${JSON.stringify(rows, null, 2)}</pre>`;
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    }

    // Reset all tables
    const resetAllButton = document.getElementById('reset-all-button');
    if (resetAllButton) {
        resetAllButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to reset all tables? This action cannot be undone.')) {
                try {
                    const response = await fetch('/api/reset/all', { method: 'DELETE' });
                    const result = await response.json();
                    if (response.ok) {
                        alert(result.message);
                        logApiCall('/api/reset/all', 'DELETE', response.status);
                        fetchTables(); // Reload table data after reset
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error('Error resetting tables:', error);
                }
            }
        });
    }

    // Load tables on page load if on the dashboard
    if (document.getElementById('table-display')) {
        fetchTables();
    }

    // Example: Monitor users and jobs
    fetchData('/api/users');
    fetchData('/api/jobs');
});
