const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/convert", (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL required" });

    const outputFile = `audio_${Date.now()}.mp3`;
    const outputPath = path.join(__dirname, outputFile);

    const command = `yt-dlp -x --audio-format mp3 -o "${outputPath}" "${url}"`;

    exec(command, (err) => {
        if (err) return res.status(500).json({ error: "Conversion failed" });

        res.download(outputPath, () => {
            fs.unlinkSync(outputPath);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running 👉 http://localhost:${PORT}`);
});
