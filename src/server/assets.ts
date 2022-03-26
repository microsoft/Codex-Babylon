import fetch from "isomorphic-fetch";

/* 
API url: https://hubble.officeapps.live.com/mediasvc/api/media/search?v=1&lang=en-US
Do a POST with this JSON for instance:  {"type":"Search","pageSize":30,"query":"dresser","parameters":{"firstpartycontent":false,"app":"office"},"descriptor":{"$type":"FirstPartyContentSearchDescriptor"}}
*/
export async function getAssetURLs(query: string) {
    console.log(`Searching for ${query}`);
    const response = await fetch(
        "https://hubble.officeapps.live.com/mediasvc/api/media/search?v=1&lang=en-US",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: "Search",
                pageSize: 30,
                query: query,
                parameters: {
                    firstpartycontent: false,
                    app: "office"
                },
                descriptor: {
                    $type: "FirstPartyContentSearchDescriptor"
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.Result;
}
