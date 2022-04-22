import { DefaultButton, ITextField, KeyCodes, PrimaryButton, Stack, TextField } from "@fluentui/react";
import React, { useRef, useCallback, useState, useEffect } from "react";
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
    const codeDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<ITextField>(null);

    const { state } = useCodexStateContext();
    const { scene } = useBabylonContext();
    const resetBabylonScene = useBabylonResetSceneDispatch();
    const resetCodexState = useCodexResetStateDispatch();

    const [currentCommand, setCurrentCommand] = useState<string>();
    const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);

    useEffect(() => {
        if(!isSendingCommand) {
            inputRef.current?.focus();
        }
    },[isSendingCommand]);

    const evalAsync = async function (code) {
        await eval("(async () => { " + code + "})()");
    };

    const handleSubmit = useCallback(() => {
        
        setIsSendingCommand(true);
        
        const nlCommand = currentCommand;
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
                console.log(`Received the following sensitiveContentFlag: ${data.sensitiveContentFlag}`);

                if(data.sensitiveContentFlag > 0) {
                    var warning = data.sensitiveContentFlag === 1
                    ? "Your message or the model's response may have contained sensitive content."
                    : "Your message or the model's response may have contained unsafe content.";

                    setCurrentCommand(""); 
                    console.warn(warning);

                    if (codeDivRef.current != null) {
                        codeDivRef.current.innerText = "Potentially sensitive language detected in prompt or completion. Try another prompt using different language.";
                    }
                }
                else {
                    if (codeDivRef.current != null && currentCommand !== undefined) {
                        codeDivRef.current.innerText = data.code;
                        
                        setCurrentCommand("");                    
                        evalAsync(data.code);
                    }
                }

                setIsSendingCommand(false);
            })
            .catch((error) => {
                console.error(error);
                setIsSendingCommand(false);
            });
    }, [currentCommand, serverUrl]);

    const handleReset = useCallback(() => {
        if (codeDivRef.current != null) {
            codeDivRef.current.innerText = "";
        }
        console.log("resetting context");
        fetch(`${serverUrl}/reset`)
            .then((response) => response.json())
            .then((res) => {
                console.log(`Reset context: ${res.context}`);
            })
            .catch((error) => console.error(error));

        // reset
        for (const key in state.intervals) {
            if (state.intervals.hasOwnProperty(key)) {
                const interval = state.intervals[key];
                console.log(`Clearing interval ${key}`);
                clearInterval(interval);
            }
        }
        
        resetBabylonScene();
        resetCodexState();
    }, [resetBabylonScene, resetCodexState, serverUrl]);

    return (
        <>
            <Stack className='commandDiv' horizontal tokens={{childrenGap:5}} horizontalAlign='start'>
                <TextField
                    componentRef={inputRef}
                    disabled={isSendingCommand}
                    onChange={(e,newValue) => setCurrentCommand(newValue)}
                    value={currentCommand}
                    styles={{root:{minWidth:400}}}
                    onKeyUp={(k)=> k.code === "Enter" ? handleSubmit() : ()=>{}}
                    placeholder="Enter Natural Language Command (e.g. 'create a cube')"
                />
                <PrimaryButton
                    styles={{root:{ minWidth:150}}}
                    disabled={isSendingCommand}
                    onClick={handleSubmit}
                >
                    Enter
                </PrimaryButton>
                <DefaultButton
                    styles={{root:{ minWidth:100}}}
                    disabled={isSendingCommand}
                    onClick={handleReset}
                >
                    Reset
                </DefaultButton>
                <div className="codeDiv">
                    <p ref={codeDivRef}></p>
                </div>
            </Stack>
        </>
    );
}
