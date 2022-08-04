require("dotenv").config();
import fetch from "isomorphic-fetch";
import {CodeEngine} from 'prompt-engine'
// Contains the helper methods for interacting with Codex and crafting model prompts
import { promptDescription, promptExamples } from "./contexts/context1";
import { detectSensitiveContent } from "./contentFiltering";

const maxPromptLength = 3200;

// CURRENTLY SINGLE TENANT - WOULD NEED TO UPDATE THIS TO A MAP OF TENANT IDs TO PROMPTS TO MAKE MULTI-TENANT
export const promptEngine: CodeEngine = new CodeEngine(promptDescription, promptExamples, {
    maxTokens: maxPromptLength, 
  });

export async function getCompletion(command: string) {      
    let prompt = promptEngine.buildPrompt(command);

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
        //throw new Error(`${response.status} ${response.statusText}`);
        const error = `There is an issue with your OpenAI credentials, please check your OpenAI API key, organization ID and model name. Modify the credentials and restart the server!`;
        if (response.status == 404){
            console.log(error);
        }
        return {error};
    }

    const json = await response.json();
    let code = json.choices[0].text;

    let sensitiveContentFlag = await detectSensitiveContent(command + "\n" + code);

    // The flag can be 0, 1 or 2, corresponding to 'safe', 'sensitive' and 'unsafe'
    if (sensitiveContentFlag > 0) {
        console.warn(
            sensitiveContentFlag === 1
            ? "Your message or the model's response may have contained sensitive content."
            : "Your message or the model's response may have contained unsafe content."
        );

        code = '';
    }
    else {
        //only allow safe interactions to be added to the context history
        promptEngine.addInteraction(command, code);
    }    

    return {
        code,
        prompt,
        sensitiveContentFlag
    };
}
