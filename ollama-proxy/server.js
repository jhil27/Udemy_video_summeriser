require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
// const axios = require('axios');
const cors = require('cors');
const OpenAI = require("openai");

// const downloadPath = "C:/Users/shreyasis/Documents/Downloads/"
const app = express();
const PORT = 3000;
// const client = new OpenAI();
app.use(cors()); // Allow all origins (or configure for security)
app.use(bodyParser.json());
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post('/chat', async (req, res) => {
    try {
        const { messages, model } = req.body;
        console.log('Received request:', { messages, model });
        const response = await openai.responses.create({
            model: "gpt-4.1",
            input: messages
        });
        console.log('Response from OpenAI:', response.output_text);
        // Create a PDF from the response text
        // const pdfFilePath = `${downloadPath}response.pdf`;
        // createPDF(response.output_text, pdfFilePath);
         res.json(response.output_text);
    } catch (error) {
        // console.error('Error proxying to OpenAI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch from OpenAI' });
    }
});

app.listen(PORT, () => {
    console.log(`🟢 OpenAI proxy server running at http://localhost:${PORT}/chat`);
});
