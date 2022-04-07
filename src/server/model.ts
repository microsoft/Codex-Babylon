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

    // To learn more about making requests to OpanAI API, please refer to https://beta.openai.com/docs/api-reference/making-requests.
    // Here we use the following endpoint pattern for engine selection.
    // https://api.openai.com/v1/engines/{engine_id}/completions
    // You can switch to different engines that are available to you. Learn more about engines - https://beta.openai.com/docs/engines/engines
    const response = await fetch(`https://api.openai.com/v1/engines/${process.env.OPENAI_ENGINE_ID}/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Organization": `${process.env.OPENAI_ORGANIZATION_ID}`
        },
        body: JSON.stringify({
            prompt,
            max_tokens: 800,
            temperature: 0,
            stop: "/*",
            n: 1
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
