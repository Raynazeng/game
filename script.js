// Initialize N, sum, and counts with values from localStorage or defaults
let n = localStorage.getItem("n") !== null ? parseInt(localStorage.getItem("n")) : 100;
let sum = localStorage.getItem("sum") !== null ? parseInt(localStorage.getItem("sum")) : 0;
let countSR = localStorage.getItem("countSR") !== null ? parseInt(localStorage.getItem("countSR")) : 0;
let countSSR = localStorage.getItem("countSSR") !== null ? parseInt(localStorage.getItem("countSSR")) : 0;
let countSSSR = localStorage.getItem("countSSSR") !== null ? parseInt(localStorage.getItem("countSSSR")) : 0;

// Save the current state of N, sum, and counts to localStorage
function saveState() {
    localStorage.setItem("n", n);
    localStorage.setItem("sum", sum);
    localStorage.setItem("countSR", countSR);
    localStorage.setItem("countSSR", countSSR);
    localStorage.setItem("countSSSR", countSSSR);
}

// Update the displayed values for both admin and client panels
function updateDisplay() {
    // Admin Panel
    document.getElementById("n-admin-display").innerText = `Current N = ${n}`;

    // Client Panel
    document.getElementById("n-client-display").innerText = `剩余抽卡次数 = ${n}`;
    document.getElementById("sum-client").innerText = `R币: ${sum}`;
    document.getElementById("sr-count-client").innerText = `免生气卡: ${countSR}`;
    document.getElementById("ssr-count-client").innerText = `愿望卡: ${countSSR}`;
    document.getElementById("sssr-count-client").innerText = `万能卡: ${countSSSR}`;

    // Disable client buttons if N is 0
    const clientButtons = document.querySelectorAll("#client-panel button:not(#logout-client-btn)");
    clientButtons.forEach(button => {
        button.disabled = n === 0;
    });
}

// Handle admin login
document.getElementById("admin-login-btn").addEventListener("click", () => {
    const password = prompt("Enter Admin Password:");
    if (password === "admin123") {
        showPanel("admin");
    } else {
        alert("Incorrect password!");
    }
});

// Handle client login
document.getElementById("client-login-btn").addEventListener("click", () => {
    showPanel("client");
});

// Handle admin logout
document.getElementById("logout-admin-btn").addEventListener("click", () => {
    showPanel("login");
});

// Handle client logout
document.getElementById("logout-client-btn").addEventListener("click", () => {
    showPanel("login");
});

// Event listener for the "Add to N" button (Admin Side)
document.getElementById("set-n-btn").addEventListener("click", () => {
    const addN = parseInt(document.getElementById("set-n-input").value);

    if (!isNaN(addN) && addN !== 0) {
        if (addN > 0) {
            // Add the number to N if it's positive
            n += addN;
            alert(`Added ${addN} to N. New N = ${n}`);
        } else {
            // Subtract the absolute value of the number if it's negative
            n = Math.max(0, n + addN); // Ensure N doesn't go below 0
            alert(`Subtracted ${Math.abs(addN)} from N. New N = ${n}`);
        }
        saveState(); // Save updated N to localStorage
        updateDisplay(); // Update the UI
    } else if (addN === 0) {
        alert("The number cannot be 0.");
    } else {
        alert("Please enter a valid number.");
    }

    document.getElementById("set-n-input").value = ""; // Clear input field
});

// Event listener for the "Reset Everything" button (Admin Side)
document.getElementById("reset-everything-btn").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset everything to 0?")) {
        n = 0;
        sum = 0;
        countSR = 0;
        countSSR = 0;
        countSSSR = 0;
        saveState(); // Save reset state to localStorage
        updateDisplay(); // Update the UI
        alert("All values have been reset to 0.");
    }
});

// Event listener for the "Generate Once" button (Client Side)
document.getElementById("generate-once-btn").addEventListener("click", () => {
    if (n > 0) {
        const result = customRandomSelection();
        handleResult(result); // Update sum and counts
        document.getElementById("result-client").innerText = `Result: ${result}`;
        n = Math.max(0, n - 1); // Decrease N by 1, ensure it doesn't go below 0
        saveState();
        updateDisplay();
    }
});

// Event listener for the "Generate 10 Times" button (Client Side)
document.getElementById("generate-ten-btn").addEventListener("click", () => {
    if (n > 0) {
        const results = generateMultipleTimes(Math.min(10, n)); // Generate up to 10 or remaining N
        results.forEach(result => handleResult(result)); // Update sum and counts
        document.getElementById("result-client").innerText = `Results: ${results.join(", ")}`;
        n = Math.max(0, n - 10); // Decrease N by 10, ensure it doesn't go below 0
        saveState();
        updateDisplay();
    }
});

// Function to handle a single result
function handleResult(result) {
    if (typeof result === "number") {
        sum += result; // Add to the sum if the result is a number
    } else if (result === "SR") {
        countSR++; // Increment SR count
    } else if (result === "SSR") {
        countSSR++; // Increment SSR count
    } else if (result === "SSSR") {
        countSSSR++; // Increment SSSR count
    }
}

// Function to generate a single random result
function customRandomSelection() {
    const rnd = Math.random();
    if (rnd < 0.90) {
        return Math.floor(Math.random() * (1000 - 10 + 1)) + 10; // Random number between 10 and 1000
    } else if (rnd < 0.95) {
        return "SR";
    } else if (rnd < 0.97) {
        return "SSR";
    } else if (rnd < 0.975) {
        return "SSSR";
    } else {
        return 0;
    }
}

// Function to generate multiple results
function generateMultipleTimes(times) {
    const results = [];
    for (let i = 0; i < times; i++) {
        results.push(customRandomSelection());
    }
    return results;
}

// Show the appropriate panel based on the role
function showPanel(panel) {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("admin-panel").classList.add("hidden");
    document.getElementById("client-panel").classList.add("hidden");

    if (panel === "admin") {
        document.getElementById("admin-panel").classList.remove("hidden");
    } else if (panel === "client") {
        document.getElementById("client-panel").classList.remove("hidden");
    } else {
        document.getElementById("login-screen").classList.remove("hidden");
    }
}

// Initialize the display on page load
updateDisplay();
showPanel("login"); // Start at the login screen
