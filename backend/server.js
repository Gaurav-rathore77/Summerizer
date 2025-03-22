require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const {HfInference}   = require("@huggingface/inference");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema
const SummarySchema = new mongoose.Schema({
    text: String,
    summary: String,
});
const Summary = mongoose.model("Summary", SummarySchema);

// Hugging Face API Key
const hf = new HfInference(process.env.HF_API_KEY);  // Get from Hugging Face

// Routes
app.get("/api/summarize", async (req, res) => {
    // const summaries = await Summary.find();
    // res.json({ summaries });
    res.send("hello");
});
app.post("/api/summarize", async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });

    try {
        const response = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
        });

        const summary = response.summary_text;

        // Save to DB
        const newSummary = new Summary({ text, summary });
        await newSummary.save();

        res.json({ summary });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to summarize text" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
