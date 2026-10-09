const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const router = express.Router();


// ==============================
// ADD NEW TASK
// ==============================

router.post("/", async (req, res) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const actualToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        const userId =
            decoded.id ||
            decoded.userId ||
            decoded._id;

        if (!userId) {
            return res.status(401).json({
                message: "Invalid user token."
            });
        }

        const {
            title,
            subject,
            deadline,
            priority,
            notificationsPerDay
        } = req.body;

        const task = new Task({
            userId,
            title,
            subject,
            deadline,
            priority,
            notificationsPerDay
        });

        await task.save();

        res.status(201).json({
            message: "Task added successfully!",
            task
        });

    } catch (error) {

        console.error("Add task error:", error);

        res.status(500).json({
            message: "Unable to add task."
        });
    }
});


// ==============================
// GET USER TASKS
// ==============================

router.get("/", async (req, res) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const actualToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        const userId =
            decoded.id ||
            decoded.userId ||
            decoded._id;

        const tasks = await Task.find({
    userId: userId,
    completed: false
}).sort({deadline:1});

        res.json(tasks);

    } catch (error) {

        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Unable to get tasks."
        });
    }
});
// ==========================================
// MARK TASK AS COMPLETED
// ==========================================

router.put("/:id/complete", async (req, res) => {

    try {

        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const actualToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        const userId =
            decoded.id ||
            decoded.userId ||
            decoded._id;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: userId
            },
            {
                completed: true
            },
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task completed successfully!",
            task: task
        });

    } catch (error) {

        console.error(
            "Complete task error:",
            error
        );

        res.status(500).json({
            message: "Unable to complete task."
        });
    }
});
// Complete a task
router.put("/:id/complete", async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const actualToken = token.replace("Bearer ", "");

        const decoded = jwt.verify(
            actualToken,
            process.env.JWT_SECRET
        );

        const userId = decoded.id || decoded.userId || decoded._id;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: userId
            },
            {
                completed: true
            },
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found."
            });
        }

        res.json({
            message: "Task completed successfully!",
            task: task
        });

    } catch (error) {
        console.error("Complete task error:", error);

        res.status(500).json({
            message: "Unable to complete task."
        });
    }
});
module.exports = router;