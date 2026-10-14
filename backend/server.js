import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import Progress from "./models/Progress.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());


// Test Route


app.get("/", (req, res) => {
    res.send("Student Progress Tracker API is running!");
});




app.post("/progress", async (req, res) => {

    try {

        const {
            studentName,
            courseName,
            completionPercentage
        } = req.body;


        const newProgress = new Progress({
            studentName,
            courseName,
            completionPercentage
        });


        await newProgress.save();


        res.status(201).json({
            success: true,
            message: "Progress added successfully!",
            progress: newProgress
        });

    } catch (error) {

        console.error(
            "Error adding progress:",
            error.message
        );


        res.status(400).json({
            success: false,
            message: "Failed to add progress.",
            error: error.message
        });

    }

});




app.get("/progress", async (req, res) => {

    try {

        const progress = await Progress
            .find()
            .sort({
                lastUpdated: -1
            });


        res.status(200).json({
            success: true,
            progress: progress
        });

    } catch (error) {

        console.error(
            "Error fetching progress:",
            error.message
        );


        res.status(500).json({
            success: false,
            message: "Failed to fetch progress."
        });

    }

});




app.put("/progress/:id", async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const {
            studentName,
            courseName,
            completionPercentage
        } = req.body;


        const updatedProgress =
            await Progress.findByIdAndUpdate(
                id,

                {
                    studentName,
                    courseName,
                    completionPercentage,

                    // Update date whenever progress changes
                    lastUpdated: new Date()
                },

                {
                    returnDocument: "after",
                    runValidators: true
                }
            );


        if (!updatedProgress) {

            return res.status(404).json({
                success: false,
                message: "Progress not found."
            });

        }


        res.status(200).json({
            success: true,
            message: "Progress updated successfully!",
            progress: updatedProgress
        });

    } catch (error) {

        console.error(
            "Error updating progress:",
            error.message
        );


        res.status(400).json({
            success: false,
            message: "Failed to update progress.",
            error: error.message
        });

    }

});




app.delete("/progress/:id", async (req, res) => {

    try {

        const {
            id
        } = req.params;


        const deletedProgress =
            await Progress.findByIdAndDelete(id);


        if (!deletedProgress) {

            return res.status(404).json({
                success: false,
                message: "Progress not found."
            });

        }


        res.status(200).json({
            success: true,
            message: "Progress deleted successfully!",
            progress: deletedProgress
        });

    } catch (error) {

        console.error(
            "Error deleting progress:",
            error.message
        );


        res.status(400).json({
            success: false,
            message: "Failed to delete progress.",
            error: error.message
        });

    }

});




mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully!"
        );


        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });