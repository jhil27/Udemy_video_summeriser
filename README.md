🧐 Udemy Transcript Summarizer - Chrome Extension

This Chrome Extension extracts transcripts from Udemy course videos, summarizes them using a local or cloud-based LLM, and downloads the result as a styled multi-page PDF.

✨ Features

✅ Automatically fetches and parses the transcript from Udemy course pages.

🧠 Summarizes content using:

Your local LLM model via Ollama

OR the OpenAI GPT API (if you have a paid account)

📄 Saves the summary as a multi-page PDF with:

Bold / Italics

Bullet points

Syntax-highlighted code blocks

⌨️ Keyboard shortcut to trigger summary manually.

🧠 Choose Your Summarization Engine

You can run this extension with either:

🔌 1. Local LLM via Ollama (Recommended)

Run a model locally without incurring OpenAI API costs.

Install Ollama

Pull a model like DeepSeek:

ollama pull deepseek-coder

Start your Ollama server and proxy it via a simple Node.js server:

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "deepseek-coder",
      prompt: req.body.messages,
      stream: false
    })
  });
  const data = await response.json();
  res.json(data.response);
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));

Make sure the extension points to http://localhost:3000/chat.

💰 2. Paid OpenAI API (Optional)

If you have access to OpenAI’s GPT-4/3.5 API:

Create a .env file in your backend folder:

OPENAI_API_KEY=sk-...


📆 Installation

Clone this repo:

git clone https://github.com/yourusername/udemy-transcript-summarizer.git

Visit chrome://extensions/ and enable Developer Mode.

Click Load unpacked and select the extension/ folder.

📄 PDF Features

Generates a multi-page PDF with:

Bold (**text**)

Italic (_text_)

Bullets

Code blocks

Automatically uses the video title as the filename.

⌨️ Keyboard Shortcut

Use Ctrl + Shift + U to trigger summarization anytime while watching a course.

👩‍💻 Contributing

Pull requests are welcome! Feel free to open issues or suggest enhancements.

📜 License

MIT License

Note: The prompt for summarization is currently hardcoded. In future updates, a UI to edit the prompt from the extension popup will be added.

