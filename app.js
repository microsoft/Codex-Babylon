const express = require('express');
const path = require('path');
const getCompletion = require('./model.js').getCompletion;
const resetPrompt = require('./model.js').resetPrompt;
const prompt = require('./model.js').prompt;
const fetch = require("isomorphic-fetch");

const app = express();
app.use(express.json());

const port = process.env.PORT || 1018;

app.get('/', (_req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

// Gets natural language and returns code
app.post('/codegen', async (req, res) => {
	console.log(req.body);
	let response = await getCompletion(req.body.text);
	// respond with code
	res.send(JSON.stringify(response));
});

// Gets natural language and returns code
app.get('/reset', async (_req, res) => {
    resetPrompt();
    res.send(JSON.stringify({prompt}));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
});
