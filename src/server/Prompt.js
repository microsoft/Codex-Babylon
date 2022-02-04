class Prompt {
	constructor(contextText) {
		this.contextText = contextText;
		this.prompt = contextText;

		this.contextInteractions = this.parseInteractions(contextText);
		this.interactions = this.contextInteractions;
	}

	// Returns the current cached prompt
	getPrompt() {
		return this.prompt;
	}

	// Adds command (modelled as a comment) to a prompt - this is what is sent to the model for it to guess the code that should be produced
	getPromptWithCommand(command) {
		return `${this.prompt}\n\n/* ${command} */\n`;
	}

	// Adds a new interaction (command and code) to the prompt, "remebering" it for future turns
	addInteraction(command, code) {
		this.prompt = `${this.prompt}\n/* ${command} */\n${code}`;
		this.prompt = this.prompt.split('\n').slice(0, -1).join('\n');
		this.interactions.push({
			command,
			code
		});
	}

	// Creates prompt using interactions (commands and code), modelling the commands as comments
	recreatePrompt() {
		this.prompt = this.interactions.reduce((prev, next) => {
			return `${prev}\n/* ${next.command} */\n${next.code}`;
		}, "");
	}

	// Removes the last interaction, "forgetting" it
	undoInteraction() {
		if (this.interactions.length > 0) {
			this.interactions.pop();
			this.recreatePrompt();
		}
	}

	// Resets prompt to the original context
	resetPrompt() {
		this.prompt = this.contextText;
		this.interactions = this.contextInteractions;
	}

	// Trims the prompt to remain under a certain length, removing interactions from the top. This is necessary to prevent the prompt from getting too long for a given model. 
	// The side effect is that the prompt will be truncated, "forgetting" past interactions or context.
	trimPrompt(length) {
		console.log("Trimming Prompt");
		while (this.prompt.length > length) {
			console.log(`Trimming oldest interaction off prompt: ${this.interactions[0].command}`);
			this.interactions = this.interactions.slice(1);
			this.recreatePrompt();
		}
		this.recreatePrompt();
	}

	// Turns a text prompt into an array of interactions (commands and code)
	parseInteractions(contextText) {
		let interactions = [];
		let lines = contextText.split("\n");
		for (let i = 0; i < lines.length; i++) {
			let line = lines[i];
			if (line.startsWith("/*")) {
				// get command, trimming whitespace
				let command = line.substring(2, line.indexOf("*/")).trim();
				let code = "";
				for (let j = i + 1; j < lines.length; j++) {
					if (lines[j].startsWith("/*")) {
						break;
					} else {
						code += lines[j] + "\n";
					}
				}
				interactions.push({
					"command": command,
					"code": code
				});
			}
		}
		return interactions;
	}
}

module.exports = {
	Prompt
}
