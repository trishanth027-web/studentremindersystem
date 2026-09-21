// ==============================
// SIGN UP
// ==============================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("signupMessage");

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

            console.log("Server response:", data);

            if (response.ok) {

                message.textContent =
                    "Account created successfully!";

                message.style.color = "green";

                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } else {

                message.textContent = data.message;
                message.style.color = "red";
            }

        } catch (error) {

            console.error("Signup error:", error);

            message.textContent =
                "Unable to connect to the server.";

            message.style.color = "red";
        }
    });
}


// ==============================
// LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("loginMessage");

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

            console.log("Login response:", data);

            if (response.ok) {

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "studentName",
                    data.user.name
                );

                message.textContent =
                    "Login successful!";

                message.style.color = "green";

                setTimeout(() => {
                    window.location.href =
                        "dashboard.html";
                }, 500);

            } else {

                message.textContent =
                    data.message;

                message.style.color = "red";
            }

        } catch (error) {

            console.error("Login error:", error);

            message.textContent =
                "Unable to connect to the server.";

            message.style.color = "red";
        }
    });
}
// ==============================
// ADD TASK
// ==============================

const taskForm = document.getElementById("taskForm");

if (taskForm) {

    taskForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const title =
            document.getElementById("taskTitle").value.trim();

        const subject =
            document.getElementById("subject").value.trim();

        const deadline =
            document.getElementById("deadline").value;

        const priority =
            document.getElementById("priority").value;

        const notificationsPerDay =
            document.getElementById("notificationsPerDay").value;

        const message =
            document.getElementById("taskMessage");

        const token =
            localStorage.getItem("token");


        // Check login
        if (!token) {

            message.textContent =
                "Please login first.";

            message.style.color = "red";

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },

                    body: JSON.stringify({

                        title: title,

                        subject: subject,

                        deadline: deadline,

                        priority: priority,

                        notificationsPerDay:
                            Number(notificationsPerDay)

                    })
                }
            );


            const data = await response.json();

            console.log("Task response:", data);


            if (response.ok) {

                message.textContent =
                    "Task added successfully!";

                message.style.color = "green";


                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 700);

            } else {

                message.textContent =
                    data.message ||
                    "Unable to add task.";

                message.style.color = "red";
            }


        } catch (error) {

            console.error("Task error:", error);

            message.textContent =
                "Unable to connect to the server.";

            message.style.color = "red";
        }

    });
}