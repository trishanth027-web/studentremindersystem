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
            userId: userId
        }).sort({
            deadline: 1
        });

        res.json(tasks);

    } catch (error) {

        console.error("Get tasks error:", error);

        res.status(500).json({
            message: "Unable to get tasks."
        });
    }
});


module.exports = router;