const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 8080;

// Allow CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function buildPrompt() {
	const workflowPath = path.join(__dirname, "api_prompt/moodboard_04.json");
	const data = await fs.readFile(workflowPath, "utf-8");
	return JSON.parse(data);
}

app.post("/generate-moodboard", async (req, res) => {
	const { theme, style, color } = req.body;

	const prompt = await buildPrompt();
	console.log(prompt);

	let clientId = crypto.randomUUID();

	prompt["11"].inputs.value = theme;
	prompt["12"].inputs.value = style;
	prompt["27"].inputs.value = color;
	prompt["9"].inputs.filename_prefix = `moodboard_${clientId}`;

	try {
		const response = await fetch("http://127.0.0.1:8000/prompt", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				prompt,
				client_id: clientId,
			}),
		});

		const data = await response.json();
		res.json({ image_id: clientId, comfyResponse: data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
});

app.listen(PORT, () => {
	console.log(`Node server running on http://localhost:${PORT}`);
});
