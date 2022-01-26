// Contains the helper methods for interacting with Codex and crafting model prompts

require('dotenv').config();
const basePrompt = require("./prompts/prompt2").basePrompt;

// CURRENTLY SINGLE TENANT - WOULD NEED TO UPDATE THIS TO A MAP OF TENANT IDs TO PROMPTS TO MAKE MULTI-TENANT
let prompt = basePrompt;

async function getCompletion(query) {
	const response = await fetch(
		'https://api.openai.com/v1/engines/davinci-codex-msft/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.CODEX_API_KEY}`
			},
			body: JSON.stringify({
				prompt: `${prompt}\n\n/* ${query} */\n`,
				max_tokens: 400,
				temperature: 0,
				stop: "/*",
				n: 1
			})
		}
	);

	// catch errors
	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	const json = await response.json();
	let code = json.choices[0].text;
	updatePrompt(query, code);

	return {
		code,
		prompt
	};
}

const resetPrompt = () => {
	console.log("resetting prompt");
	prompt = basePrompt;
}

const updatePrompt = (query, code) => {
	prompt = `${prompt}\n/* ${query} */\n${code}`;
	prompt = prompt.split('\n').slice(0, -1).join('\n');
	console.log(`Updated prompt with '${query}' and '${code}'`);
}

// export functions
module.exports = {
	getCompletion,
	resetPrompt,
	prompt
}
