// --- 1. NAVIGATION & LOADING ---
document.addEventListener("DOMContentLoaded", () => {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('nexus_user'));
    
    // If we are on the login page and already logged in, redirect to home
    if(window.location.pathname.includes('login.html') && currentUser) {
        window.location.href = 'index.html'; 
    }
    
    updateNav(); // Update nav bar if it exists
});

// Update the Navigation Bar
function updateNav() {
    const user = JSON.parse(localStorage.getItem('nexus_user'));
    const navAuth = document.getElementById('nav-auth');
    
    if (user && navAuth) {
        navAuth.innerHTML = `@${user.telegram}`;
        // If clicked, go to Admin if admin, else stay or logout
        navAuth.href = user.role === 'admin' ? "admin.html" : "#";
        // Add a logout button next to it
        navAuth.insertAdjacentHTML('afterend', ` <a href="#" onclick="logout()" style="font-size:0.8em; margin-left:10px; color:#555;">(X)</a>`);
    }
}

// --- 2. AUTHENTICATION LOGIC ---

// Toggle between Login / Register / Forgot
function switchView(sectionId) {
    document.querySelectorAll('.auth-section').forEach(el => el.classList.remove('active-section'));
    document.getElementById(sectionId).classList.add('active-section');
}

// LOGIN FUNCTION
function performLogin() {
    const email = document.getElementById('l-email').value.trim();
    const pass = document.getElementById('l-pass').value.trim();

    // 1. Check Admin Hardcode
    if (email === "admin@nexus.com" && pass === "admin123") {
        const adminUser = { email: email, telegram: "NexusAdmin", role: "admin" };
        localStorage.setItem('nexus_user', JSON.stringify(adminUser));
        alert("ADMIN ACCESS GRANTED");
        window.location.href = "admin.html";
        return;
    }

    // 2. Check Registered Users
    const users = JSON.parse(localStorage.getItem('nexus_db') || "[]");
    const foundUser = users.find(u => u.email === email && u.pass === pass);

    if (foundUser) {
        localStorage.setItem('nexus_user', JSON.stringify(foundUser));
        alert("WELCOME BACK, AGENT " + foundUser.telegram);
        window.location.href = "index.html"; // Redirect to Home
    } else {
        alert("ACCESS DENIED: Invalid Email or Password.");
    }
}

// REGISTER FUNCTION
function performRegister() {
    const email = document.getElementById('r-email').value.trim();
    const tele = document.getElementById('r-tele').value.trim().replace('@', '');
    const pass = document.getElementById('r-pass').value.trim();

    if (!email || !tele || !pass) {
        alert("ERROR: All fields are required.");
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('nexus_db') || "[]");

    // Check duplicate
    if (users.find(u => u.email === email)) {
        alert("ERROR: Email already registered.");
        return;
    }

    // Create and Save
    const newUser = { email: email, telegram: tele, pass: pass, role: 'user' };
    users.push(newUser);
    
    localStorage.setItem('nexus_db', JSON.stringify(users));
    localStorage.setItem('nexus_user', JSON.stringify(newUser)); // Auto-login

    alert("IDENTITY VERIFIED. Welcome to Nexus.");
    window.location.href = "index.html";
}

// RESET REQUEST FUNCTION
function performResetRequest() {
    const email = document.getElementById('f-email').value.trim();
    if(!email) return alert("Enter Email");
    
    alert("REQUEST SENT. Admin will review.");
    switchView('login-sec');
}

// LOGOUT FUNCTION
function logout() {
    localStorage.removeItem('nexus_user');
    window.location.href = "login.html";
}

// --- 3. BUYING LOGIC ---
function buyItem(itemName, price) {
    const user = localStorage.getItem('nexus_user');
    if (!user) {
        alert("RESTRICTED: Please Login first.");
        window.location.href = "login.html";
        return;
    }
    localStorage.setItem('nexus_cart', JSON.stringify({ item: itemName, price: price }));
    window.location.href = "payment.html";
}
