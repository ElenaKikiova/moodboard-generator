# Moodboard Generator with ComfyUI

## Installation

Prerequizites: ComfyUI + Node.js installed

1. Pull this repo
2. Open a terminal in the folder and run `npm i`

## Run

1. Open ComfyUI and wait for it to load
2. In a terminal in the root folder of moodboard-generator, run `node server.js`.
   This will start the proxy server for ComfyUI API on port 8081
   Check http://localhost:8081/ it should display Moodboard Generator API is running.
3. Open the file index.html as a file in the browser (file:///Users/.../index.html)
4. Enter the criteria for the moodboard and click Generate.
   This can take around 40sec-1min to generate.
5. The image will be saved in /outputs folder of ComfyUI and shown in the UI project.
