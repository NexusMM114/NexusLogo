// --- Session Management ---
document.addEventListener("DOMContentLoaded", () => {
    updateNav();
    if(document.getElementById('admin-user-list')) renderAdmin();
});

function updateNav() {
    const user = JSON.parse(localStorage.getItem('nexus_user'));
    const authLink = document.getElementById('nav-auth');
    if(user && authLink) {
        authLink.innerHTML = `<span style="color:var(--neon-blue)">@${user.telegram}</span>`;
        authLink.href = user.role === 'admin' ? "admin.html" : "index.html";
    }
}

// --- Buy Logic ---
function buyItem(name, price) {
    const user = localStorage.getItem('nexus_user');
    if(!user) {
        alert("ACCESS DENIED: Identity verification required.");
        window.location.href = "login.html";
        return;
    }
    localStorage.setItem('nexus_cart', JSON.stringify({item: name, price: price}));
    window.location.href = "payment.html";
}

// --- Auth System ---
function login(email, pass) {
    if(email === "admin@nexus.com" && pass === "admin123") {
        const user = {email, telegram: "NexusMM", role: "admin"};
        localStorage.setItem('nexus_user', JSON.stringify(user));
        window.location.href = "admin.html";
        return;
    }
    const db = JSON.parse(localStorage.getItem('nexus_db') || "[]");
    const found = db.find(u => u.email === email && u.pass === pass);
    if(found) {
        localStorage.setItem('nexus_user', JSON.stringify(found));
        window.location.href = "index.html";
    } else { alert("INVALID CREDENTIALS"); }
}

function register(email, tele, pass) {
    const db = JSON.parse(localStorage.getItem('nexus_db') || "[]");
    const newUser = {email, telegram: tele.replace('@',''), pass, role: 'user'};
    db.push(newUser);
    localStorage.setItem('nexus_db', JSON.stringify(db));
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    alert("IDENTITY CREATED");
    window.location.href = "index.html";
}

function logout() {
    localStorage.removeItem('nexus_user');
    window.location.href = "login.html";
}
