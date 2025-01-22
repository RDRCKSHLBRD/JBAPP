document.addEventListener("DOMContentLoaded", () => {
    const apiLogDiv = document.getElementById("api-log");
    const dataOutputDiv = document.getElementById("data-output");
    const responseElement = document.getElementById("response");
    const tableDisplay = document.getElementById("table-display");
    const resetAllButton = document.getElementById("reset-all-button");
    const refreshButton = document.getElementById("refresh-button");
    const loadDataButton = document.getElementById("load-data-button"); // Ensure this is defined

    // Log API call activity
    function logApiCall(endpoint, method, status) {
        if (!apiLogDiv) {
            console.error("Error: #api-log element not found in the DOM.");
            return;
        }
        const timestamp = new Date().toLocaleString();
        const logEntry = document.createElement("div");
        logEntry.textContent = `${timestamp} - ${method} ${endpoint} - Status: ${status}`;
        apiLogDiv.appendChild(logEntry);
    }

    // Ping JBAPP server
    if (refreshButton) {
        refreshButton.addEventListener("click", async () => {
            try {
                const response = await fetch("/api/ping");
                const data = await response.json();
                if (responseElement) {
                    responseElement.innerText = `Server Response: ${data.message}`;
                }
                logApiCall("/api/ping", "GET", response.status);
            } catch (error) {
                if (responseElement) {
                    responseElement.innerText = `Error: ${error.message}`;
                }
                logApiCall("/api/ping", "GET", "Error");
                console.error("Error pinging the server:", error);
            }
        });
    }

    // Fetch data from JBAPP endpoints
    async function fetchData(endpoint) {
        if (!dataOutputDiv) {
            console.error("Error: #data-output element not found in the DOM.");
            return;
        }
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            logApiCall(endpoint, "GET", response.status);

            // Clear existing content and append new data
            const dataTitle = document.createElement("h3");
            dataTitle.classList.add("data-title");
            dataTitle.textContent = `Data from ${endpoint}`;
            const dataContent = document.createElement("pre");
            dataContent.textContent = JSON.stringify(data, null, 2);

            dataOutputDiv.innerHTML = ""; // Clear previous data
            dataOutputDiv.appendChild(dataTitle);
            dataOutputDiv.appendChild(dataContent);
        } catch (error) {
            logApiCall(endpoint, "GET", "Error");
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    }

    // Fetch dynamic database tables
    async function fetchTables() {
        if (!tableDisplay) {
            console.error("Error: #table-display element not found in the DOM.");
            return;
        }
        try {
            const response = await fetch("/api/admin/tables");
            const tableData = await response.json();
            tableDisplay.innerHTML = ""; // Clear existing data

            for (const [tableName, rows] of Object.entries(tableData)) {
                const tableTitle = document.createElement("h3");
                tableTitle.classList.add("table-title");
                tableTitle.textContent = `Table: ${tableName}`;
                const tableContent = document.createElement("pre");
                tableContent.textContent = JSON.stringify(rows, null, 2);

                tableDisplay.appendChild(tableTitle);
                tableDisplay.appendChild(tableContent);
            }
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    }

    // Reset all tables
    if (resetAllButton) {
        resetAllButton.addEventListener("click", async () => {
            if (confirm("Are you sure you want to reset all tables? This action cannot be undone.")) {
                const resetPassword = prompt("Enter the reset password:");
                if (!resetPassword) {
                    alert("Password is required to reset tables.");
                    return;
                }

                try {
                    const response = await fetch("/api/reset/all", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ password: resetPassword }),
                    });
                    const result = await response.json();

                    if (response.ok) {
                        alert(result.message);
                        logApiCall("/api/reset/all", "DELETE", response.status);
                        fetchTables(); // Reload table data after reset
                    } else {
                        alert(`Error: ${result.error}`);
                    }
                } catch (error) {
                    console.error("Error resetting tables:", error);
                    alert("An error occurred while resetting tables.");
                }
            }
        });
    }

    // Monitor users and jobs with the Load Data button
    if (loadDataButton) {
        loadDataButton.addEventListener("click", () => {
            fetchData("/api/users");
            fetchData("/api/jobs");
        });
    }

    // Automatically load data and tables on page load
    fetchData("/api/users");
    fetchData("/api/jobs");
    fetchTables();
});
