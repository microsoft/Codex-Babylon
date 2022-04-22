import fetch from "isomorphic-fetch";

export async function detectSensitiveContent(content: string): Promise<number> {
    const response = await fetch('https://api.openai.com/v1/engines/content-filter-alpha/completions', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "OpenAI-Organization": `${process.env.OPENAI_ORGANIZATION_ID}`
        },
        body: JSON.stringify({
            prompt: `<|endoftext|>[${content}]\n--\nLabel:`,
            temperature: 0,
            max_tokens: 1,
            top_p: 0,
            logprobs: 10,
        })
    });

    var json = await response.json();
    
    const filterFlag = json.choices[0].text as string;
    return parseInt(filterFlag);
}