/**
 * Class for creating and managing contexts and prompts for Codex. We define the context as a set of examples and previous interactions, whereas
 * a prompt is a context plus command, which we pass to the model to get a code response.
 *
 * We keep track of both the text context and an array of interactions in order to facilitate "undoing" of interactions, and removal of the oldest
 * interactions (see `trimContext`) when a context gets too large for the model.
 */

type Interaction = {
    command: string;
    code: string;
};

export default class Context {
    private baseContext: string;
    private context: string;
    private baseInteractions: Interaction[];
    private interactions: Interaction[];

    constructor(baseContext: string) {
        this.baseContext = baseContext;
        this.context = baseContext;

        this.baseInteractions = this.createInteractionsFromContext(baseContext);
        this.interactions = this.baseInteractions;
    }

    // Returns the current cached prompt
    getContext() {
        return this.context;
    }

    // Adds command (modelled as a comment) to a context, creating our prompt to the model
    getPrompt(command: string) {
        return `${this.context}\n\n/* ${command} */\n`;
    }

    // Adds a new interaction (command and code) to the prompt, "remembering" it for future turns
    addInteraction(command: string, code: string) {
        let context = `${this.context}\n/* ${command} */\n${code}`;
        this.context = context.split("\n").slice(0, -1).join("\n");
        this.interactions.push({
            command,
            code
        });
    }

    // Removes the last interaction, "forgetting" it
    undoInteraction() {
        if (this.interactions.length > 0) {
            this.interactions.pop();
            this.createContextFromInteractions();
        }
    }

    // Resets prompt to the original context
    resetContext() {
        this.context = this.baseContext;
        this.interactions = this.baseInteractions;
    }

    // Trims the prompt to remain under a certain length, removing interactions from the top. This is necessary to prevent the prompt from getting too long for a given model.
    // The side effect is that the prompt will be truncated, "forgetting" past interactions or context.
    trimContext(length: number) {
        console.log("Trimming Context");
        while (this.context.length > length) {
            console.log(
                `Trimming oldest interaction off context: ${this.interactions[0].command}`
            );
            this.interactions = this.interactions.slice(1);
            this.createContextFromInteractions();
            console.log(`New prompt length: ${this.context.length}`);
        }
        this.createContextFromInteractions();
    }

    // Creates prompt using interactions (commands and code), modelling the commands as comments
    createContextFromInteractions() {
        this.context = this.interactions.reduce((prev, next) => {
            return `${prev}\n/* ${next.command} */\n${next.code}`;
        }, "");
    }

    // Turns a text prompt into an array of interactions (commands and code) - this is effectively the inverse of the createContextFromInteractions method
    createInteractionsFromContext(baseContext) {
        let interactions: Interaction[] = [];
        let lines = baseContext.split("\n");
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
                    command,
                    code
                });
            }
        }
        return interactions;
    }
}
