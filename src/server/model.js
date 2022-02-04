// Contains the helper methods for interacting with Codex and crafting model prompts

require('dotenv').config();
const basePrompt = require("./prompts/prompt1").basePrompt;
const Prompt = require("./Prompt").Prompt;

const maxLengthOfPrompt = 3500;

// CURRENTLY SINGLE TENANT - WOULD NEED TO UPDATE THIS TO A MAP OF TENANT IDs TO PROMPTS TO MAKE MULTI-TENANT
let prompt = new Prompt(basePrompt);

async function getCompletion(command) {
	let promptWithCommand = prompt.getPromptWithCommand(command);
	console.log(`Length of prompt: ${promptWithCommand.length}`);
	if (promptWithCommand.length > maxLengthOfPrompt) {
		prompt.trimPrompt(maxLengthOfPrompt - command.length);
	}

	const response = await fetch(
		'https://api.openai.com/v1/engines/cushman-codex-msft/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.CODEX_API_KEY}`
			},
			body: JSON.stringify({
				prompt: prompt.getPromptWithCommand(command),
				max_tokens: 800,
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
	prompt.addInteraction(command, code);

	return {
		code,
		prompt
	};
}

// export functions
module.exports = {
	getCompletion,
	prompt
}
