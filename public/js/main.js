document.addEventListener('DOMContentLoaded', () => {
    const apiLogDiv = document.getElementById('api-log');
    const dataOutputDiv = document.getElementById('data-output');
    const responseElement = document.getElementById('response');
    const tableDisplay = document.getElementById('table-display');
    const resetAllButton = document.getElementById('reset-all-button');
    const refreshButton = document.getElementById('refresh-button');

    // Log API call activity
    function logApiCall(endpoint, method, status) {
        if (!apiLogDiv) {
            console.error('Error: #api-log element not found in the DOM.');
            return;
        }
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
    if (refreshButton) {
        refreshButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/ping');
                const data = await response.json();
                if (responseElement) {
                    responseElement.innerText = `Server Response: ${data.message}`;
                }
                logApiCall('/api/ping', 'GET', response.status);
            } catch (error) {
                if (responseElement) {
                    responseElement.innerText = `Error: ${error.message}`;
                }
                logApiCall('/api/ping', 'GET', 'Error');
                console.error('Error pinging the server:', error);
            }
        });
    }

   // Fetch data from JBAPP endpoints
async function fetchData(endpoint) {
    if (!dataOutputDiv) {
        console.error('Error: #data-output element not found in the DOM.');
        return;
    }
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        logApiCall(endpoint, 'GET', response.status);

        // Create the <h3> element and add a class
        const dataTitle = document.createElement('h3');
        dataTitle.classList.add('data-title'); // Add your desired class here
        dataTitle.textContent = `Data from ${endpoint}`;

        // Create the <pre> element for the data
        const dataContent = document.createElement('pre');
        dataContent.textContent = JSON.stringify(data, null, 2);

        // Append the title and data to the output div
        dataOutputDiv.appendChild(dataTitle);
        dataOutputDiv.appendChild(dataContent);
    } catch (error) {
        logApiCall(endpoint, 'GET', 'Error');
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
}


    // Fetch dynamic database tables
// Fetch dynamic database tables
async function fetchTables() {
    if (!tableDisplay) {
        console.error('Error: #table-display element not found in the DOM.');
        return;
    }
    try {
        const response = await fetch('/api/tables');
        const tableData = await response.json();
        tableDisplay.innerHTML = ''; // Clear existing data

        for (const [tableName, rows] of Object.entries(tableData)) {
            // Create the <h3> element and add a class
            const tableTitle = document.createElement('h3');
            tableTitle.classList.add('table-title'); // Add your desired class here
            tableTitle.textContent = `Table: ${tableName}`;

            // Append the title and rows to the display
            tableDisplay.appendChild(tableTitle);
            const tableContent = document.createElement('pre');
            tableContent.textContent = JSON.stringify(rows, null, 2);
            tableDisplay.appendChild(tableContent);
        }
    } catch (error) {
        console.error('Error fetching tables:', error);
    }
}

   // Reset all tables
if (resetAllButton) {
    resetAllButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to reset all tables? This action cannot be undone.')) {
            const resetPassword = prompt('Enter the reset password:');
            if (!resetPassword) {
                alert('Password is required to reset tables.');
                return;
            }

            try {
                const response = await fetch('/api/reset/all', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ password: resetPassword }),
                });
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
                alert('An error occurred while resetting tables.');
            }
        }
    });
}


    // Load tables on page load if on the dashboard
    if (tableDisplay) {
        fetchTables();
    }

    // Example: Monitor users and jobs
    fetchData('/api/users');
    fetchData('/api/jobs');
});
