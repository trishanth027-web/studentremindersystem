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
// ==========================================
// DASHBOARD - SHOW FIRST 3 TASKS
// ==========================================

const taskList = document.getElementById("taskList");

if (taskList) {

    async function loadDashboardTasks() {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:5000/api/tasks",
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            const tasks = await response.json();
            window.dashboardTasks = tasks;

            console.log("Dashboard tasks:", tasks);

            if (!response.ok) {
                throw new Error(
                    tasks.message || "Unable to load tasks."
                );
            }

            taskList.innerHTML = "";

            // No tasks
            if (!tasks || tasks.length === 0) {

                taskList.innerHTML = `
                    <div class="no-tasks">
                        <h3>No tasks yet</h3>
                        <p>
                            You don't have any academic tasks.
                            Add a task to get started.
                        </p>
                    </div>
                `;

                return;
            }

            // Show only first 3 tasks
            const firstThreeTasks = tasks.slice(0, 3);

            firstThreeTasks.forEach(function(task) {

                const deadline = new Date(task.deadline);

                const formattedDate =
                    deadline.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                    });

                const formattedTime =
                    deadline.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit"
                    });

                const taskItem = document.createElement("div");

                taskItem.className = "task-item";

                taskItem.innerHTML = `

                    <div class="task-check empty">
                    onclick="completeTask('${task._id}')">
                    </div>

                    <div class="task-information">

                        <h3>
                            ${task.title}
                        </h3>

                        <p>
                            ${task.subject}
                        </p>

                    </div>

                    <div class="task-deadline">

                        <strong>
                            ${formattedDate}
                        </strong>

                        <small>
                            ${formattedTime}
                        </small>

                    </div>

                `;

                taskList.appendChild(taskItem);

            });

        }

        catch (error) {

            console.error(
                "Dashboard task error:",
                error
            );

            taskList.innerHTML = `

                <div class="no-tasks">

                    <h3>
                        Unable to load tasks
                    </h3>

                    <p>
                        ${error.message}
                    </p>

                </div>

            `;
        }
    }

    loadDashboardTasks();
}
/* =========================================================
   ACADEMIC NOTIFICATION SYSTEM
   ========================================================= */

let notificationTask = null;

const academicNotification =
    document.getElementById("academicNotification");

const notificationTitle =
    document.getElementById("notificationTitle");

const notificationMessage =
    document.getElementById("notificationMessage");

const snoozeNotification =
    document.getElementById("snoozeNotification");

const viewNotificationTask =
    document.getElementById("viewNotificationTask");

const closeNotification =
    document.getElementById("closeNotification");


/* -----------------------------------------
   CHECK IF TASK WAS SNOOZED
   ----------------------------------------- */

function isTaskSnoozed(taskId) {

    const snoozeTime =
        localStorage.getItem("notificationSnooze_" + taskId);

    if (!snoozeTime) {
        return false;
    }

    const currentTime = Date.now();

    const snoozeUntil = Number(snoozeTime);

    /*
       If 10 minutes have passed,
       remove the snooze.
    */

    if (currentTime >= snoozeUntil) {

        localStorage.removeItem(
            "notificationSnooze_" + taskId
        );

        return false;
    }

    return true;
}


/* -----------------------------------------
   FORMAT REMINDER MESSAGE
   ----------------------------------------- */

function createNotificationMessage(task) {

    const deadline =
        new Date(task.deadline);

    const currentTime =
        new Date();

    const difference =
        deadline.getTime() -
        currentTime.getTime();

    const minutes =
        Math.floor(
            difference / (1000 * 60)
        );

    const hours =
        Math.floor(minutes / 60);

    const days =
        Math.floor(hours / 24);


    /* Overdue */

    if (difference < 0) {

        return `Your ${task.subject} task "${task.title}" is overdue. Please complete it as soon as possible.`;
    }


    /* Due today */

    if (days === 0) {

        if (hours <= 1) {

            return `"${task.title}" is due very soon. Try to complete it before the deadline.`;

        }

        return `"${task.title}" is due today. You still have time to finish it.`;
    }


    /* Due tomorrow */

    if (days === 1) {

        return `"${task.title}" is due tomorrow. Consider starting it now.`;
    }


    /* More than one day */

    return `"${task.title}" is due in ${days} days. Plan your work early to avoid last-minute pressure.`;
}


/* -----------------------------------------
   SHOW NOTIFICATION
   ----------------------------------------- */

function showAcademicNotification(task) {

    if (!academicNotification) {
        return;
    }

    notificationTask = task;

    notificationTitle.textContent =
        task.title;

    notificationMessage.textContent =
        createNotificationMessage(task);

    academicNotification.classList.add(
        "show"
    );
}


/* -----------------------------------------
   HIDE NOTIFICATION
   ----------------------------------------- */

function hideAcademicNotification() {

    if (!academicNotification) {
        return;
    }

    academicNotification.classList.remove(
        "show"
    );
}


/* -----------------------------------------
   FIND A TASK THAT NEEDS A REMINDER
   ----------------------------------------- */

function checkAcademicNotifications(taskList) {

    if (!taskList || taskList.length === 0) {
        return;
    }


    /*
       Don't show another popup while
       one is already visible.
    */

    if (
        academicNotification &&
        academicNotification.classList.contains("show")
    ) {
        return;
    }


    const currentTime =
        new Date();


    /*
       Find tasks that are:
       - not completed
       - due within the next 3 days
       - not currently snoozed
    */

    const reminderTask =
        taskList.find(task => {

            if (task.completed) {
                return false;
            }


            const deadline =
                new Date(task.deadline);


            const difference =
                deadline.getTime() -
                currentTime.getTime();


            const threeDays =
                3 * 24 * 60 * 60 * 1000;


            /*
               Show reminders for tasks
               due within 3 days.
            */

            if (difference > threeDays) {
                return false;
            }


            /*
               Ignore tasks that have
               been snoozed.
            */

            if (
                isTaskSnoozed(task._id)
            ) {
                return false;
            }


            return true;
        });


    if (reminderTask) {

        showAcademicNotification(
            reminderTask
        );
    }
}


/* -----------------------------------------
   REMIND ME AFTER 10 MINUTES
   ----------------------------------------- */

if (snoozeNotification) {

    snoozeNotification.addEventListener(
        "click",
        function () {

            if (!notificationTask) {
                return;
            }


            /*
               Current time + 10 minutes
            */

            const tenMinutesLater =
                Date.now() +
                (10 * 60 * 1000);


            localStorage.setItem(
                "notificationSnooze_" +
                notificationTask._id,

                tenMinutesLater.toString()
            );


            hideAcademicNotification();


            /*
               Check again after 10 minutes.
            */

            setTimeout(
                function () {

                    /*
                       Remove snooze so the
                       task can be shown again.
                    */

                    localStorage.removeItem(
                        "notificationSnooze_" +
                        notificationTask._id
                    );


                    if (notificationTask) {

                        showAcademicNotification(
                            notificationTask
                        );
                    }

                },

                10 * 60 * 1000
            );
        }
    );
}


/* -----------------------------------------
   VIEW TASK
   ----------------------------------------- */

if (viewNotificationTask) {

    viewNotificationTask.addEventListener(
        "click",
        function () {

            if (!notificationTask) {
                return;
            }


            /*
               Save the task ID so the
               My Tasks page can identify it.
            */

            localStorage.setItem(
                "selectedTaskId",

                notificationTask._id
            );


            /*
               Open My Tasks.
            */

            window.location.href =
                "my-tasks.html";
        }
    );
}


/* -----------------------------------------
   CLOSE BUTTON
   ----------------------------------------- */

if (closeNotification) {

    closeNotification.addEventListener(
        "click",
        function () {

            /*
               We don't treat this as a
               permanent dismissal.

               The notification disappears
               for this display only.
            */

            hideAcademicNotification();
        }
    );
}


/* -----------------------------------------
   START NOTIFICATION CHECK
   ----------------------------------------- */

function startAcademicNotificationSystem() {

    /*
       Wait a little after dashboard loads
       so the page and tasks are ready.
    */

    setTimeout(
        function () {

            /*
               Use the existing dashboard
               task loading function if
               the task list is available.
            */

            if (
                typeof window.dashboardTasks !==
                "undefined"
            ) {

                checkAcademicNotifications(
                    window.dashboardTasks
                );

            }

        },

        1500
    );


    /*
       Check every minute.

       This allows a reminder to appear
       without refreshing the page.
    */

    setInterval(
        function () {

            if (
                typeof window.dashboardTasks !==
                "undefined"
            ) {

                checkAcademicNotifications(
                    window.dashboardTasks
                );

            }

        },

        60 * 1000
    );
}


startAcademicNotificationSystem();