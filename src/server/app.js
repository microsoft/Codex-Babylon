const express = require('express');
const path = require('path');
const getCompletion = require('./model.js').getCompletion;
const prompt = require('./model.js').prompt;
const getAssetURLs = require('./assets.js').getAssetURLs;
const fetch = require("isomorphic-fetch");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public'));

const port = process.env.SERVER_PORT;
app.use(cors({origin: `http://localhost:${process.env.CLIENT_PORT}`}));

app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

// Gets natural language and returns code
app.post('/codegen', async (req, res) => {
	console.log(`Received natural language command: '${req.body.text}'`);
	const response = await getCompletion(req.body.text);
	res.send(JSON.stringify(response));
});

// Gets natural language and returns code
app.get('/reset', async (_req, res) => {
	prompt.resetPrompt();
	res.send(JSON.stringify({
		prompt: prompt.getPrompt()
	}));
});

// GET asset URLs
app.get('/assetUrls', async (req, res) => {
	let asset = req.query.text;
	const response = await getAssetURLs(asset);
	res.send(JSON.stringify(response));
});

app.listen(port, () => {
	console.log(`Babylex webapp listening at http://localhost:${port}`)
});
