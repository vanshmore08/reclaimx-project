let isSignUp = false;
let isAdminMode = false;

const BACKEND_URL = "https://reclaimx-project.onrender.com/api";

/* Toggle Login / Signup */
function toggleForm(type) {
    isSignUp = (type === 'signup');

    document.getElementById("formTitle").innerText =
        isSignUp ? "Create Account" : "Welcome Back";

    document.getElementById("formSubtitle").innerText =
        isSignUp
            ? "Join our campus community today."
            : "Please enter your details to continue.";

    document.getElementById("loginActions").style.display = isSignUp ? "none" : "block";
    document.getElementById("signupActions").style.display = isSignUp ? "block" : "none";

    document.getElementById("loginTab").classList.toggle("active", !isSignUp);
    document.getElementById("signupTab").classList.toggle("active", isSignUp);
}

/* Toggle Admin / User */
function toggleRole() {
    isAdminMode = !isAdminMode;

    document.getElementById("adminCodeGroup").style.display =
        isAdminMode ? "block" : "none";

    document.getElementById("toggleRoleBtn").innerText =
        isAdminMode ? "Switch to User Access" : "Switch to Admin Access";

    document.getElementById("roleText").innerText =
        isAdminMode ? "Accessing as Admin" : "Accessing as Student/Faculty";
}

/* Password eye */
function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

/* ================= LOGIN ================= */
async function handleLogin() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pass").value.trim();
    const adminCode = document.getElementById("adminCode").value.trim();

    if (!email || !password) {
        alert("Please fill all required fields");
        return;
    }

    if (isAdminMode && adminCode !== "Vansh290108") {
        alert("Invalid admin code!");
        return;
    }

    try {
        const res = await fetch(`${BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: email,
                password
            })
        });

        const data = await res.json();

        if (res.ok) {
            if (isAdminMode) {
                sessionStorage.setItem("adminLoggedIn", "true");
                window.location.href = "dashboard.html";
            } else {
                sessionStorage.setItem("userLoggedIn", "true");
                sessionStorage.setItem("loggedInUserEmail", email);
                window.location.href = "user-access.html";
            }
        } else {
            alert(data.message || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error while logging in");
    }
}

/* ================= SIGNUP ================= */
async function handleSignup() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("pass").value.trim();

    if (!email || !password) {
        alert("Please fill all required fields");
        return;
    }

    try {
        const res = await fetch(`${BACKEND_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: email,
                password
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Account created successfully! Please login.");
            toggleForm("login");
        } else {
            alert(data.message || "Signup failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error while signing up");
    }
}
