import React, { useRef } from "react";
import "./Form.css";

interface IFormProps {
    scene: any;
    state: any;
    createScene: () => any;
}

export default function Form({ scene, state, createScene }: IFormProps) {
    const serverUrl = `http://localhost:${process.env.SERVER_PORT}`;
    const inputRef = useRef<HTMLInputElement>(null);
    const codeDivRef = useRef<HTMLDivElement>(null);

    const evalAsync = async function (code) {
        await eval("(async () => { " + code + "})()");
    };

    const resetScene = function () {
        scene.dispose();
        scene = createScene();
        state = {};
    };

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
                    onClick={() => {
                        const nlCommand = inputRef.current?.value;
                        console.log(
                            "Sending natural language command: " + nlCommand
                        );

                        fetch(`${serverUrl}/codegen`, {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json; charset=utf-8"
                            },
                            body: JSON.stringify({
                                text: nlCommand
                            })
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(
                                    `Received the following code: ${data.code}`
                                );

                                if (
                                    codeDivRef.current != null &&
                                    inputRef.current != null
                                ) {
                                    codeDivRef.current.innerText = data.code;
                                    inputRef.current.value = "";
                                    evalAsync(data.code);
                                }
                            })
                            .catch((error) => console.error(error));
                    }}
                >
                    Enter
                </button>
                <button
                    type="submit"
                    onClick={() => {
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

                        resetScene();
                    }}
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
