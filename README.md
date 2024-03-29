# Codex Babylon Prototype

This project converts natural language into 3D assets using [BabylonJS](https://www.babylonjs.com/) and OpenAI's [Codex](https://openai.com/blog/openai-codex/):

![Codex Babylon GIF](codex-babylon.gif)

The project is made up of a React web application frontend with an [Express](https://expressjs.com/) backend.

## Statement of Purpose
This repository aims to grow the understanding of using Codex in applications by providing an example of implementation and references to support the [Microsoft Build conference in 2022](https://mybuild.microsoft.com/). It is not intended to be a released product. Therefore, this repository is not for discussing OpenAI API, BabylonJS or requesting new features.

## Requirements

* Node.JS
* An [OpenAI account](https://openai.com/api/)
    * [OpenAI API Key](https://beta.openai.com/account/api-keys).
    * [OpenAI Organization Id](https://beta.openai.com/account/org-settings). If you have multiple organizations, please update your [default organization](https://beta.openai.com/account/api-keys) to the one that has access to codex engines before getting the organization Id.
    * [OpenAI Engine Id](https://beta.openai.com/docs/engines/codex-series-private-beta). It provides access to a model. For example, `code-davinci-002` or `code-cushman-001`. See [here](#what-openai-engines-are-available-to-me) for checking available engines.

## Running the App

1. Clone the repo: `git clone https://github.com/microsoft/Codex-Babylon` and open the `Codex-Babylon` folder.
2. Create a `.env` file in the root directory of the project, copying the contents of the `.env.example` file. 
3. In `.env`, provide the following configuration:

    |Config Name|Description|
    |--|--|
    |`OPENAI_API_KEY`|The [OpenAI API key](https://beta.openai.com/account/api-keys).|
    |`OPENAI_ORGANIZATION_ID`|Your [OpenAI organization id](https://beta.openai.com/account/org-settings).<br/>If you have multiple organizations, please update your [default organization](https://beta.openai.com/account/api-keys) to the one that has access to codex engines before getting the organization id.|
    |`OPENAI_ENGINE_ID`|The [OpenAI engine id](https://beta.openai.com/docs/engines/codex-series-private-beta) that provides access to a model. For example, `code-davinci-002` or `code-cushman-001`.<br/>See [here](#what-openai-engines-are-available-to-me) for checking available engines.|
    |`SERVER_PORT`|The port to run the server code. Default to `1200`.|
    |`CLIENT_PORT`|The port to run the web app. Default to `3000`. |

4. Run `npm install` to gather the projects' dependencies.
5. Run `npm run start` to serve the backend and launch the web application.

## Using the App

The app consists of a basic text box to enter natural language commands, and a 3D scene to display the results. Enter commands into the text box and press enter to see the results. Note that conversation context is maintained between commands, so subsequent commands can refer back to previous ones.

Example commands:

  > _Create a cube_

  > _Make it red and make it spin_

  >_Put a teal sphere above it and another below it_

  > _Make the bottom sphere change colors when the cursor hovers over it_

## Debugging
To debug the web application, you can [debug with VSCode debugger](https://code.visualstudio.com/Docs/editor/debugging).

To debug the code generated from codex, the current debugging experience is basic:
 - Observe logs in your browser dev tools (F12) to debug issues evaluating generated code
 - Observe logs in your console to debug issues between the Express server, Codex, and the client

## Understand the Code
The server and client code is under `src/`.
### Client (src/client)
- `index.tsx` is the entry to bootstrap the React web application.
- `index.html` is the barebones main view of the app. It uses Bootstrap for basic styling.

### Server (src/server)
- `app.ts` is the main entry point for the app. It sets up the Express to serve RESTful APIs after being transpile into JavaScript (output: `dist\server\app.js`).
- `model.ts` manages interaction the Codex API. This uses `isomorphic-fetch` to make POST calls of natural language to be converted to code. It also includes helper methods for engineering the prompt that is sent to Codex (see "prompt engineering" below).

## Prompt Engineering

Generative models like Codex are trained on the simple task of guessing the next token in a sequence. A good practice to coax the kind of tokens (code) you want from Codex is to include context and example interactions in a prompt - this practice is called few-shot prompt engineering. These examples are sent to the model with every API call, along with your natural language query. Codex then "guesses" the next tokens in the sequence (the code that satisfies the natural language).

This project currently contains "contexts" - examples of what we expect from the model in the `src/server/contexts` folder. A context consists of a description to the model of what will be in the prompt along with examples of Natural Language and the code it should produce. See snippet of `context1` from the `contexts` folder:


```js
/* This document contains natural language commands and the BabylonJS code needed to accomplish them */

state = {};

/* Make a cube */
state.cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);

/* Move the cube up */
state.cube.position.y += 1;

/* Move it to the left */
state.cube.position.x -= 1;
```

As you can see, the first line gives a description of the prompt (explaining to Codex that it should take natural language commands and produce BabylonJS code. It then shows a single line of contextual code, establishing the existence of a `state` object to be used by Codex. Finally, it gives several examples of natural language and code to give Codex a sense of the kind of code it should write. These examples use the `state` object mentioned above to save new Babylon objects onto. It also establishes a kind of conversational interaction with the model, where a natural language command might refer to something created on a past turn ("Move it to..."). These examples help nudge the model to produce this kind of code on future turns. 

The project also includes a `Context` class (see `Context.ts`) that offers several helpers for loading contexts and creating prompts. As a user interacts with the experience, we update the context to include past commands and responses. On subsequent conversation turns, this gives the model the relevant context to do things like pronoun resolution (e.g. of "it" in "make it red").

Currently a single ongoing context is maintained on the server. This can be reset with the "Reset" button in the app. The single context means that the app is currently not multi-tenanted, and that multiple browser instances will reuse the same context. Note that prompts to Codex models can only be so long - as the prompt exceeds a certain token limit, the `Context` class will shorten the prompt from the beginning.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

## FAQ
### What OpenAI engines are available to me?
You might have access to different [OpenAI engines](https://beta.openai.com/docs/api-reference/engines) per OpenAI organization. To check what engines are available to you, one can query the [List engines API](https://beta.openai.com/docs/api-reference/engines/list) for available engines. See the following commands:

* Shell
```
curl https://api.openai.com/v1/engines \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'OpenAI-Organization: YOUR_ORG_ID'
```

* Windows Command Prompt (cmd)
```
curl --ssl-no-revoke https://api.openai.com/v1/engines --header OpenAI-Organization:YOUR_ORG_ID --oauth2-bearer YOUR_API_KEY
```

### Can I run the sample on Azure?
The sample code can be currently be used with Codex on OpenAI’s API. In the coming months, the sample will be updated so you can use it also with the [Azure OpenAI Service](https://aka.ms/azure-openai). 
