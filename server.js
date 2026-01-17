const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = 8080;

const comfyAPI = "http://127.0.0.1:8000";

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

	let clientId = crypto.randomUUID();

	const fileName = `moodboard_${clientId}`;
	console.log(theme, style, color);

	prompt["11"].inputs.value = theme;
	prompt["12"].inputs.value = style;
	prompt["27"].inputs.value = color;
	prompt["3"].inputs.seed = Math.floor(Math.random() * 1_000_000_000);
	prompt["9"].inputs.filename_prefix = fileName;

	try {
		const response = await fetch(`${comfyAPI}/prompt`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				prompt,
				client_id: clientId,
			}),
		});

		const data = await response.json();

		const imageUrl = `${comfyAPI}/view?filename=${encodeURIComponent(
			fileName
		)}_00001_.png&type=output`;
		console.log("Generated image URL:", imageUrl, fileName, data.prompt_id);

		res.json({ image_url: imageUrl, comfyUIdata: data });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err });
	}
});

app.listen(PORT, () => {
	console.log(`Node server running on http://localhost:${PORT}`);
});
