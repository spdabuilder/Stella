```javascript
const express = require("express");
const OpenAI = require("openai");
const fs = require("fs");

const app = express();

app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Load Stella's personality from stella.txt
let STELLA_INSTRUCTIONS;

try {
    STELLA_INSTRUCTIONS = fs.readFileSync("./stella.txt", "utf8");
    console.log("Stella personality loaded successfully.");
} catch (error) {
    console.error("Could not load stella.txt:", error);
    process.exit(1);
}

app.get("/", (req, res) => {
    res.send("Stella AI server is online!");
});

app.post("/ai", async (req, res) => {
    try {
        const message = req.body.message;

        if (typeof message !== "string" || message.trim() === "") {
            return res.status(400).json({
                error: "A message is required."
            });
        }

        const response = await client.responses.create({
            model: "gpt-5",
            instructions: STELLA_INSTRUCTIONS,
            input: message.trim()
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("Stella AI error:", error);

        res.status(500).json({
            error: "Stella could not respond."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Stella AI server is running on port " + PORT);
});
