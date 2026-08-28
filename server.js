const express = require("express");
const OpenAI = require("openai");
const fs = require("fs");

const app = express();

app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

const stellaInstructions = fs.readFileSync("./stella.txt", "utf8");

app.get("/", (req, res) => {
    res.send("Stella AI server is online!");
});

app.post("/ai", async (req, res) => {
    const message = req.body.message;

    if (typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({
            error: "A message is required."
        });
    }

    try {
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: stellaInstructions
                },
                {
                    role: "user",
                    content: message.trim()
                }
            ]
        });

        return res.json({
            reply: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Stella AI error:", error);

        return res.status(500).json({
            error: "Stella could not respond."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Stella AI server is running on port " + PORT);
});
