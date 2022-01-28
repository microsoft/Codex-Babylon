import React, { useEffect, useRef } from "react";
import Form from "./components/Form";
import "./App.css";

// temp workaround to deal with the global variable of babylon CDN
interface customWindow extends Window {
    BABYLON?: any;
}

declare const window: customWindow;

export default function App() {
    console.log("App rendered");
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // TODO: should we create provider for these global states?
    let engine: any = null;
    let scene: any = null;
    let state: any = {};
    let createScene: any = null;

    useEffect(() => {
        engine = new window.BABYLON.Engine(canvasRef.current, true); // Generate the BABYLON 3D engine

        // BABYLON CODE
        createScene = function () {
            const _scene = new window.BABYLON.Scene(engine);
            const camera = new window.BABYLON.ArcRotateCamera(
                "camera",
                -Math.PI / 2,
                Math.PI / 2.5,
                15,
                new window.BABYLON.Vector3(0, 0, 0)
            );
            camera.attachControl(canvasRef.current, true);
            camera.wheelPrecision = 5;

            const light = new window.BABYLON.HemisphericLight(
                "light",
                new window.BABYLON.Vector3(1, 1, 0)
            );

            return _scene;
        };

        scene = createScene();
        state = {};

        engine.runRenderLoop(function () {
            scene.render();
        });

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
            engine.resize();
        });
    });

    return (
        <>
            <canvas ref={canvasRef} touch-action="none" className="renderCanvas"></canvas>
            <Form scene={scene} state={state} createScene={createScene} />
        </>
    );
}
