require("dotenv").config();
import fetch from "isomorphic-fetch";

// Contains the helper methods for interacting with Codex and crafting model prompts
import { baseContext } from "./contexts/context1";
import Context from "./Context";

const maxPromptLength = 3200;

// CURRENTLY SINGLE TENANT - WOULD NEED TO UPDATE THIS TO A MAP OF TENANT IDs TO PROMPTS TO MAKE MULTI-TENANT
export const context = new Context(baseContext);

export async function getCompletion(command: string) {
    let prompt = context.getPrompt(command);

    if (prompt.length > maxPromptLength) {
        context.trimContext(maxPromptLength - command.length + 6); // The max length of the prompt, including the command, comment operators and spacing.
    }

    const response = await fetch(`${process.env.ENDPOINT}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CODEX_API_KEY}`
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 800,
            temperature: 0,
            stop: "/*",
            n: 1
            // model: `${process.env.MODEL}`
        })
    });

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
