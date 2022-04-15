import { DefaultButton, IconButton, ITextField, KeyCodes, PrimaryButton, Stack, TextField } from "@fluentui/react";
import React, { useRef, useCallback, useState, useEffect } from "react";
import {
    useBabylonContext,
    useBabylonResetSceneDispatch
} from "../context/babylonContext";
import {
    useCodexResetStateDispatch,
    useCodexStateContext
} from "../context/codexContext";
import { IState, UndoRedo } from "../undoredo";
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

    const undoAction = async (state: IState[]) => {
        resetBabylonScene();
        resetCodexState();

        for(var s of state) {            
            await evalAsync(s);
        }
    }

    const redoAction = async (state: IState) => {        
        evalAsync(state.code);   
        
        await evalAsync(state);
    }

    const [undoRedo, ] = useState<UndoRedo>(new UndoRedo(undoAction, redoAction));


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

                if (codeDivRef.current != null && currentCommand !== undefined) {
                    codeDivRef.current.innerText = data.code;
                    
                    setCurrentCommand("");      
                    undoRedo.append(data.code);              
                    evalAsync(data.code);
                }

                setIsSendingCommand(false);
            })
            .catch((error) => {
                console.error(error);
                setIsSendingCommand(false);
            });
    }, [state, scene, currentCommand] /* state and scene are used by evalAsync*/);

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
        resetBabylonScene();
        resetCodexState();
        undoRedo.reset();
    }, []);

    const handleUndo = useCallback(async ()=> {
        fetch(`${serverUrl}/undo`)
            .then((response) => { 
                if(response.ok) {
                    undoRedo.undo();
                }
            })            
            .catch((error) => console.error(error));
    },[]);

    const handleRedo = useCallback(()=> {
        fetch(`${serverUrl}/redo`)
            .then((response) => { 
                if(response.ok) {
                    undoRedo.redo();
                }
            })            
            .catch((error) => console.error(error));
    },[]);

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
                <Stack.Item align='center'>
                    <IconButton onClick={handleUndo} iconProps={{iconName:'Undo'}} />
                </Stack.Item>
                <Stack.Item align='center'>
                    <IconButton onClick={handleRedo} iconProps={{iconName:'Redo'}} />
                </Stack.Item>
                <div className="codeDiv">
                    <p ref={codeDivRef}></p>
                </div>
            </Stack>
        </>
    );
}
