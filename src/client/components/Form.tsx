import { DefaultButton, ITextField, KeyCodes, Panel, PanelType, PrimaryButton, Stack, TextField } from "@fluentui/react";
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

import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { useBoolean } from "@fluentui/react-hooks";
initializeIcons();

export default function Form() {
    const serverUrl = `http://localhost:${process.env.SERVER_PORT}`;
    const inputRef = useRef<ITextField>(null);

    const { state } = useCodexStateContext();
    const { scene } = useBabylonContext();
    const resetBabylonScene = useBabylonResetSceneDispatch();
    const resetCodexState = useCodexResetStateDispatch();

    const [currentCommand, setCurrentCommand] = useState<string>();
    const [isSendingCommand, setIsSendingCommand] = useState<boolean>(false);

    const [codeChunks, setCodeChunks] = useState<string[]>([]);

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

                if (currentCommand !== undefined) {
                    codeChunks.push(data.code);

                    setCodeChunks([...codeChunks]);

                    setCurrentCommand("");
                    evalAsync(data.code);
                }

                setIsSendingCommand(false);
            })
            .catch((error) => {
                console.error(error);
                setIsSendingCommand(false);
            });
    }, [currentCommand, serverUrl]);    

    const handleReset = useCallback(() => {
        setCodeChunks([...[]]);
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

    const [isOpen, { setTrue: openCodePanel, setFalse: dismissCodePanel }] = useBoolean(false);    

    return (
        <div>
            <Stack className='commandDiv' horizontalAlign='center' tokens={{childrenGap:5}} >
                <Stack horizontal tokens={{childrenGap:5, padding: 10}} horizontalAlign='stretch'>                 
                    <TextField
                        componentRef={inputRef}
                        multiline
                        disabled={isSendingCommand}
                        onChange={(e,newValue) => setCurrentCommand(newValue)}
                        value={currentCommand}
                        styles={{root:{width:'90vw'}}}
                        onKeyUp={(k)=> k.code === "Enter" ? handleSubmit() : ()=>{}}
                        placeholder="Enter Natural Language Command (e.g. 'create a cube')"
                    />
                    <DefaultButton
                        iconProps={{iconName:'Processing'}}
                        disabled={isSendingCommand}
                        styles={{root:{width:'60', height:'auto'}}}
                        onClick={handleSubmit}>
                        Execute
                    </DefaultButton>                
                </Stack>
                <Stack horizontal tokens={{childrenGap:5}} >
                    <DefaultButton
                            iconProps={{iconName:'Delete'}}
                        disabled={isSendingCommand}
                        onClick={handleReset}
                    >
                        Reset
                    </DefaultButton>
                    <DefaultButton
                            iconProps={{iconName:'Code'}}
                        disabled={isSendingCommand}
                        onClick={()=>openCodePanel()}
                    >
                        View Code
                    </DefaultButton>
                </Stack>
            </Stack>
            <Panel
                headerText="Code"
                type={PanelType.largeFixed}
                isOpen={isOpen}
                isLightDismiss={true}
                onDismiss={dismissCodePanel}
                closeButtonAriaLabel="Close">
                   {codeChunks.map((c,idx) => <p key={idx}>{c}</p>)}
              </Panel>  
        </div>
    );
}
