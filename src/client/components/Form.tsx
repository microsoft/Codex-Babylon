import React, { useRef, useCallback } from "react";
import {
    useBabylonContext,
    useBabylonResetSceneDispatch
} from "../context/babylonContext";
import {
    useCodexResetStateDispatch,
    useCodexStateContext
} from "../context/codexContext";
import "./Form.css";

export default function Form() {
    const serverUrl = `http://localhost:${process.env.SERVER_PORT}`;
    const inputRef = useRef<HTMLInputElement>(null);
    const codeDivRef = useRef<HTMLDivElement>(null);

    const { state } = useCodexStateContext();
    const { scene } = useBabylonContext();
    const resetBabylonScene = useBabylonResetSceneDispatch();
    const resetCodexState = useCodexResetStateDispatch();

    const evalAsync = async function (code) {
        await eval("(async () => { " + code + "})()");
    };

    const handleSubmit = useCallback(() => {
        const nlCommand = inputRef.current?.value;
        console.log("Sending natural language command: " + nlCommand);

        fetch(`${serverUrl}/codegen`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify({
                text: nlCommand
            })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(`Received the following code: ${data.code}`);

                if (codeDivRef.current != null && inputRef.current != null) {
                    codeDivRef.current.innerText = data.code;
                    inputRef.current.value = "";
                    evalAsync(data.code);
                }
            })
            .catch((error) => console.error(error));
    }, [state, scene] /* state and scene are used by evalAsync*/);

    const handleReset = useCallback(() => {
        if (codeDivRef.current != null) {
            codeDivRef.current.innerText = "";
        }
        console.log("resetting prompt");
        fetch(`${serverUrl}/reset`)
            .then((response) => response.json())
            .then((res) => {
                console.log(`Reset prompt: ${res.prompt}`);
            })
            .catch((error) => console.error(error));

        // reset
        resetBabylonScene();
        resetCodexState();
    }, []);

    return (
        <>
            <div className="commandDiv">
                <input
                    ref={inputRef}
                    className="form-control"
                    type="text"
                    placeholder="Enter Natural Language Command (e.g. 'create a cube')"
                />
                <button
                    type="submit"
                    className="btn btn-primary mb-2 submitButton"
                    onClick={handleSubmit}
                >
                    Enter
                </button>
                <button
                    type="submit"
                    onClick={handleReset}
                    className="btn btn-primary mb-2 resetButton"
                >
                    Reset
                </button>
                <div className="codeDiv">
                    <p ref={codeDivRef}></p>
                </div>
            </div>
        </>
    );
}
