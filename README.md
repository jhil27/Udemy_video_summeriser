<video src='C:/Users/shreyasis/Downloads/udemy_transcript_summeriser.mp4' width=180/>
```markdown
# 🧠 Udemy Transcript Summarizer Extension

This Chrome extension automatically extracts video transcripts from Udemy course pages, summarizes them using a backend powered by OpenAI's GPT API, and downloads a well-formatted multi-page PDF.

---

## 📁 Project Structure

```

📦 your-project-root/
├── 📁 udemy-temperer/      # Chrome Extension code
├── 📁 ollama-proxy/        # Node.js backend using OpenAI API
└── README.md

````

---

## ✨ Features

- ✅ Automatically parses Udemy transcript for the current video
- 💬 Summarizes it using OpenAI's GPT-4 or GPT-3.5
- 📄 Downloads a **styled multi-page PDF** with:
  - **Bold / Italics**
  - Bullet points
  - Java code blocks
- 📛 PDF file is named after the course title
- ⌨️ Trigger summary using a **keyboard shortcut**

---

## 🛠 Setup Instructions

### 🔧 1. Chrome Extension (`udemy-temperer/`)

1. Go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `udemy-temperer/` folder
5. Make sure the extension is enabled

📌 Default keyboard shortcut: `Ctrl + Shift + U`

You can modify it via `chrome://extensions/shortcuts`.

---

### 🧠 2. Backend API with OpenAI (`ollama-proxy/`)

> This project uses the **paid OpenAI API** to summarize content.

#### ✅ Step 1: Create `.env` in `ollama-proxy/`

```env
OPENAI_API_KEY=sk-...
````

#### ✅ Step 2: Install dependencies

```bash
cd ollama-proxy
npm install
```

#### ✅ Step 3: Start the server

```bash
node server.js
# Or if you use nodemon
npm run dev
```

Make sure this proxy is listening on `http://localhost:3000/chat` — the extension is hardcoded to call this endpoint.

🧠 Choose Your Summarization Engine
You can run this extension with either:

🔌 1. Local LLM via Ollama
Run a model locally without incurring OpenAI API costs.

Install Ollama

Pull a model like DeepSeek:
```bash
ollama pull deepseek-r1
```
* Start your Ollama server and proxy it via a simple Node.js server:
```bash
// POST /chat
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: "deepseek-r1",
      prompt: req.body.messages,
      stream: false
    })
  });
  const data = await response.json();
  res.json(data.response); /// send only content and not the whole object
});

app.listen(3000, () => console.log('✅ Server running at http://localhost:3000'));

```
Make sure this proxy is listening on `http://localhost:3000/chat` — the extension is hardcoded to call this endpoint.

## 📄 PDF Features

* Fully styled **multi-page PDF** download:

  * Course title as header
  * Preserves **bold**, *italic*, and bullet points
  * Syntax-highlighted Java code blocks (Markdown-friendly)
* Dynamically paginated with automatic wrapping
* Filename: `[Course Title].pdf`

---

## 📦 Customization

### 🧠 Prompt Customization

You can update the summarization prompt directly in `udemy-temperer/content.js`.

```js
const prompt = `
Summarize the following Udemy transcript focusing only on technical topics...
`;
```

> ✅ Coming Soon: UI to set your custom prompt via popup.

---

## 🧪 Testing

* Open a Udemy course video
* Press `Ctrl + Shift + U`
* Wait for summary
* The styled PDF will automatically download

---

## 📜 License

MIT

---

## 🤝 Contributions

PRs welcome! You can extend:

* Prompt UI in the popup
* Local Ollama model support
* More formatting options (e.g. diagrams)

---

## 💬 Questions?

Feel free to open an [issue](https://github.com/jhil27/Udemy_video_summeriser/issues) or ping me!
```
