import express from "express";
import path from "path";
import { context, getCompletion } from "./model";
import { getAssetURLs } from "./assets.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const port = process.env.SERVER_PORT;
app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}` }));

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

// Gets natural language and returns code
app.post("/codegen", async (req, res) => {
    console.log(`Received natural language command: '${req.body.text}'`);
    const response = await getCompletion(req.body.text);
    res.send(JSON.stringify(response));
});

// Gets natural language and returns code
app.get("/reset", async (_req, res) => {
    context.resetContext();
    res.send(
        JSON.stringify({
            context: context.getContext()
        })
    );
});

// GET asset URLs
app.get("/assetUrls", async (req, res) => {
    let asset = req.query.text;
    const response = await getAssetURLs(asset);
    res.send(JSON.stringify(response));
});

app.listen(port, () => {
    console.log(`Babylex webapp listening at http://localhost:${port}`);
});
