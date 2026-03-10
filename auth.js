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

async function saveProject() {
 const { data: userData } = await supabase.auth.getUser();
 const user = userData.user;

 const projectData = {
   user_id: user.id,
   name: "default",
   html: models.html.getValue(),
   css: models.css.getValue(),
   js: models.javascript.getValue(),
   updated_at: new Date()
 };

 const { error } = await supabase
   .from("projects")
   .upsert(projectData, { onConflict: "user_id,name" });

 if (error) console.error(error.message);
}

async function loadProject() {
 const { data: userData } = await supabase.auth.getUser();
 const user = userData.user;

 const { data, error } = await supabase
   .from("projects")
   .select("*")
   .eq("user_id", user.id)
   .eq("name", "default")
   .single();

 if (data) {
   models.html.setValue(data.html);
   models.css.setValue(data.css);
   models.javascript.setValue(data.js);
 }
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

    // const hashedPassword = simpleHash(password);
    const newUser = { name, email, password: password};
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPassword').value = '';
    
    showSuccess(errorEl, `Added "${name}"!`);

}

// ✅ NEW LOGIN - Replace old login function
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error(error.message);
    alert('Login failed: ' + error.message);
    return;
  }

  showDashboard(data.user);
}

async function logout() {
    await supabase.auth.signOut();
    // Redirect or show login form
    window.location.href = 'login.html';
}
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.style.display = 'none';

    users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showError(errorEl, 'Invalid email or password');
        return;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    showSuccess(errorEl, 'Login successful!');


      // Redirect to product page after successful login
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

// document.addEventListener('DOMContentLoaded', async function() {
//     const { data: { session } } = await supabase.auth.getSession();
//     if (session && window.showDashboard) {
//         showDashboard(session.user);
//     }
// });

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
