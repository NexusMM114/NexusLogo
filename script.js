document.addEventListener("DOMContentLoaded", () => {
    initStore();
    updateNav();
});

function initStore() {
    if(!localStorage.getItem('nexus_products')) {
        const defaults = [
            { id: 1, type: 'logo', name: 'Neon Genesis', price: 99, img: 'https://drive.google.com/thumbnail?id=1JWGYxoMn6cq0wG8z1rvejLHXJIt518-7' },
            { id: 2, type: 'qr', name: 'Vortex QR', price: 49, img: 'https://drive.google.com/thumbnail?id=1z_dMjlBOuytoNwONO-CEQ-VlwNRv08jB' }
        ];
        localStorage.setItem('nexus_products', JSON.stringify(defaults));
    }
}

function updateNav() {
    const user = JSON.parse(localStorage.getItem('nexus_user'));
    const settings = JSON.parse(localStorage.getItem('nexus_settings') || "{}");
    const brand = document.querySelector('.brand');
    
    if(brand) {
        brand.innerHTML = (settings.pfp ? `<img src="${settings.pfp}">` : '') + `NEXUS`;
    }

    const authLink = document.getElementById('nav-auth');
    if(user && authLink) {
        authLink.innerHTML = `<span style="color:var(--neon-blue)">@${user.telegram}</span>`;
        authLink.href = user.role === 'admin' ? "admin.html" : "#";
        
        const navDiv = document.querySelector('.nav-links');
        if(navDiv && !document.getElementById('logout-btn')) {
            const btn = document.createElement('a');
            btn.id = 'logout-btn'; btn.innerHTML = " [EXIT]"; btn.onclick = logout; btn.style.cursor="pointer";
            navDiv.appendChild(btn);
        }
    }
}

function buyItem(name, price, img) {
    if(!localStorage.getItem('nexus_user')) {
        showToast("ACCESS DENIED: LOGIN REQUIRED", "error");
        setTimeout(() => window.location.href="login.html", 1500);
        return;
    }
    localStorage.setItem('nexus_cart', JSON.stringify({name, price, img}));
    window.location.href = "payment.html";
}

function logout() { localStorage.removeItem('nexus_user'); window.location.href="login.html"; }

function showToast(msg, type='success') {
    const container = document.getElementById('toast-container') || createToastContainer();
    const box = document.createElement('div');
    box.className = `toast ${type}`;
    let icon = "✅";
    if(type === 'error') icon = "❌";
    if(type === 'info') icon = "ℹ️";
    box.innerHTML = `<span style="margin-right:8px;">${icon}</span> ${msg}`;
    container.appendChild(box);
    setTimeout(() => box.remove(), 4000);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'toast-container'; document.body.appendChild(div); return div;
}
