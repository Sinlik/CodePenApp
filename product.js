// product.js - DEBUG VERSION
console.log("product.js loaded");

function showDashboard(user) {
    console.log("showDashboard called with:", user);  // DEBUG
    
    // Hide forms if they exist
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'none';
    
    // Show topbar and workspace
    document.getElementById('topbar').style.display = 'flex';
    console.log("Topbar should now be visible");  // DEBUG
    
    // UPDATE SPACER TEXT
    const spacer = document.querySelector('.spacer');
    if (spacer) {
        spacer.textContent = `Hello ${user.name}`;
        console.log("Spacer updated to:", spacer.textContent);  // DEBUG
    } else {
        console.log("ERROR: .spacer not found!");  // DEBUG
    }
}

// Check login on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded");  // DEBUG
    const currentUser = localStorage.getItem('currentUser');
    console.log("currentUser from localStorage:", currentUser);  // DEBUG
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showDashboard(user);
    } else {
        console.log("No currentUser found - show login forms");
    }
});
