// Contains the helper methods for interacting with Codex and crafting model prompts

require('dotenv').config();
const baseContext = require("./contexts/context1").baseContext;
const Context = require("./Context").Context;

const maxPromptLength = 3200;

// CURRENTLY SINGLE TENANT - WOULD NEED TO UPDATE THIS TO A MAP OF TENANT IDs TO PROMPTS TO MAKE MULTI-TENANT
let context = new Context(baseContext);

async function getCompletion(command) {
	let prompt = context.getPrompt(command);

	if (prompt.length > maxPromptLength) {
		context.trimContext(maxPromptLength - (command.length) + 6); // The max length of the prompt, including the command, comment operators and spacing.
	}

	const response = await fetch(
		`${process.env.ENDPOINT}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.CODEX_API_KEY}`
			},
			body: JSON.stringify({
				prompt,
				max_tokens: 800,
				temperature: 0,
				stop: "/*",
				n: 1,
				model: `${process.env.MODEL}`
			})
		}
	);

	// catch errors
	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText}`);
	}

	const json = await response.json();
	let code = json.choices[0].text;
	context.addInteraction(command, code);

	return {
		code,
		prompt
	};
}

// export functions
module.exports = {
	getCompletion,
	context
}
