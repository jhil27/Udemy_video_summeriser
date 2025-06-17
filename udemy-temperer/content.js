const LOCAL_API_URL = "http://localhost:3000/chat"; // Your local Node.js server endpoint

function openTranscriptPanel() {
    const toggleBtn = document.querySelector('[data-purpose="transcript-toggle"]');
    if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === "false") {
        toggleBtn.click();
        console.log("✅ Transcript panel toggled open.");
    } else {
        console.log("ℹ️ Transcript panel already open or not found.");
    }
}

function closeTranscriptPanel() {
    const toggleBtn = document.querySelector('[data-purpose="transcript-toggle"]');
    if (toggleBtn && toggleBtn.getAttribute('aria-expanded') === "true") {
        toggleBtn.click();
        console.log("✅ Transcript panel toggled closed.");
    } else {
        console.log("ℹ️ Transcript panel already closed or not found.");
    }
}

function waitForTranscript() {
    return new Promise(resolve => {
        const check = () => {
            const cues = document.querySelectorAll('p[data-purpose="transcript-cue"]');
            if (cues.length > 0) resolve(cues);
            else setTimeout(check, 1000);
        };
        check();
    });
}

async function summarizeTranscript(transcript) {
    const prompt = `
        Summarize the following Udemy course transcript by focusing **only on the Java concepts, code examples, and technical explanations**. Ignore the instructor's tone, speech, and delivery style.

        Highlight:
        - The Java topic being explained (e.g., polymorphism, inheritance)
        - Key classes, methods, keywords, and patterns
        - Include relevant Java code snippets using Markdown code blocks
        - Avoid conversational summaries or non-technical descriptions

        Respond using Markdown format with:

        **Title:**  
        [Short topic title]

        **Summary:**  
        - Bullet points of technical details  
        - Java code in triple-backtick code blocks

        Transcript:
        ${transcript}
        `;
    const response = await fetch(LOCAL_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: prompt
        })
    });

    if (!response.ok) {
        console.error(`❌ Local API Error: ${response.status}`);
        return { title: "Transcript Summary", summary: `Error: ${response.status}` };
    }

    const raw = await response.json();
    // const raw = data.content || data.result || ""; // adapt based on your API shape
    const titleMatch = raw.match(/\*\*Title:\*\*\s*(.*?)\n/i);
    const summaryMatch = raw.match(/\*\*Summary:\*\*\s*([\s\S]*)/i);

    const title = titleMatch ? titleMatch[1].trim() : "Transcript Summary";
    const summary = summaryMatch ? summaryMatch[1].trim() : raw.trim();

    return { title, summary };
}

function sanitizeFilename(filename) {
    return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}
function tokenizeMarkdown(line) {
    const regex = /(\*\*(.*?)\*\*|_(.*?)_)/g;
    let tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIndex) {
            // Push plain text before the match
            tokens.push({
                text: line.substring(lastIndex, match.index),
                bold: false,
                italic: false
            });
        }

        if (match[1].startsWith('**')) {
            tokens.push({
                text: match[2],
                bold: true,
                italic: false
            });
        } else if (match[1].startsWith('_')) {
            tokens.push({
                text: match[3],
                bold: false,
                italic: true
            });
        }

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
        // Remaining plain text after the last match
        tokens.push({
            text: line.substring(lastIndex),
            bold: false,
            italic: false
        });
    }

    return tokens;
}

// Function to tokenize Markdown text for jsPDF rendering
function downloadAsPdfFile(markdownSummary, title = "Transcript Summary") {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const margin = 15;
    const lineHeight = 8;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, margin, y);
    y += 10;

    const lines = markdownSummary.split('\n');
    let insideCodeBlock = false;
    let codeBuffer = [];

    const addPageIfNeeded = () => {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
    };

    for (let line of lines) {
        // Handle code blocks
        if (line.trim().startsWith('```')) {
            if (!insideCodeBlock) {
                insideCodeBlock = true;
                codeBuffer = [];
            } else {
                insideCodeBlock = false;

                // Render code block
                doc.setFont("courier", "normal");
                doc.setFontSize(10);
                const codeLines = doc.splitTextToSize(codeBuffer.join('\n'), maxWidth - 10);
                codeLines.forEach(codeLine => {
                    addPageIfNeeded();
                    doc.text(codeLine, margin + 5, y);
                    y += lineHeight;
                });
                y += 4; // extra space after code
            }
            continue;
        }

        if (insideCodeBlock) {
            codeBuffer.push(line);
            continue;
        }

        // Convert bullet points
        let isBullet = false;
        if (/^\s*[-*+]\s+/.test(line)) {
            isBullet = true;
            line = line.replace(/^\s*[-*+]\s+/, '• ');
        }

        // Parse for bold/italic
        const tokens = tokenizeMarkdown(line);
        let currentX = margin + (isBullet ? 5 : 0);

        for (const token of tokens) {
            const { text, bold, italic } = token;
            doc.setFont("times", bold ? "bold" : "normal");
            doc.setFontSize(italic ? 11 : 12);

            const splitLines = doc.splitTextToSize(text, maxWidth - (currentX - margin));
            for (let i = 0; i < splitLines.length; i++) {
                addPageIfNeeded();
                doc.text(splitLines[i], currentX, y);
                y += i < splitLines.length - 1 ? lineHeight : 0;
                currentX = margin;
            }
            currentX += doc.getTextWidth(splitLines[splitLines.length - 1] || '');
        }

        y += lineHeight;
    }

    const filename = sanitizeFilename(title) + ".pdf";
    doc.save(filename);
}


async function run() {
    openTranscriptPanel();

    const cues = await waitForTranscript();
    const fullTranscript = Array.from(cues).map(p => p.textContent.trim()).join('\n');

    console.log("⏳ Sending full transcript to local model...");
    const { title, summary } = await summarizeTranscript(fullTranscript);
    downloadAsPdfFile(summary, title);
    closeTranscriptPanel();
    console.log("✅ Summary downloaded as transcript_summary.txt");
    alert("📥 Summary downloaded! Check your downloads folder.");
}

// window.addEventListener('load', () => {
//     setTimeout(run, 5000);
// });
window.addEventListener("RUN_SUMMARY_SCRIPT", () => {
    run();
  });