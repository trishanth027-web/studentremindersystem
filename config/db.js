
const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("signupMessage");

        // Check passwords
        if (password !== confirmPassword) {

            message.textContent = "Passwords do not match.";
            message.style.color = "red";

            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                message.textContent = data.message;
                message.style.color = "green";

                setTimeout(function() {
                    window.location.href = "login.html";
                }, 1000);

            } else {

                message.textContent = data.message;
                message.style.color = "red";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

            message.style.color = "red";
        }

    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("loginMessage");

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save login information temporarily
                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "studentName",
                    data.user.name
                );

                message.textContent = data.message;
                message.style.color = "green";

                setTimeout(function() {
                    window.location.href = "dashboard.html";
                }, 500);

            } else {

                message.textContent = data.message;
                message.style.color = "red";
            }

        } catch (error) {

            console.error(error);

            message.textContent =
                "Unable to connect to the server.";

            message.style.color = "red";
        }

    });
}