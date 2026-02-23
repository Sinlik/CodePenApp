let users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (window.showDashboard) {  // Only call if on product page
            showDashboard(user);
        }
    }
});

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const errorEl = document.getElementById('signupError');
    errorEl.style.display = 'none';

    if (password.length < 6) {
        showError(errorEl, 'Password must be at least 6 characters');
        return;
    }
    if (users.find(u => u.email === email)) {
        showError(errorEl, 'Email already registered');
        return;
    }

    const hashedPassword = simpleHash(password);
    const newUser = { name, email, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    
    showSuccess(errorEl, `Added "${name}"!`);
    
    // Redirect to product page after signup
    setTimeout(() => {
        window.location.href = 'product.html';
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.style.display = 'none';

    users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = simpleHash(password);
    const user = users.find(u => u.email === email && u.password === hashedPassword);
    
    if (!user) {
        showError(errorEl, 'Invalid email or password');
        return;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    showSuccess(errorEl, 'Login successful!');
    
    // Redirect to product page after login
    setTimeout(() => {
        window.location.href = 'product.html';
    }, 1000);
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('topbar').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.className = 'error';
    setTimeout(() => element.style.display = 'none', 5000);
}

function showSuccess(element, message) {
    element.textContent = message;
    element.style.display = 'block';
    element.className = 'success';
    setTimeout(() => element.style.display = 'none', 5000);
}
