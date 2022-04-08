import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

type BabylonProviderProps = {
    children?: ReactNode;
};

export type BabylonResetSceneDispatch = () => void;

type BabylonContext = {
    engine: BABYLON.Engine | null;
    scene: BABYLON.Scene | null;
};

const BabylonStateContext = createContext<BabylonContext>({
    engine: null,
    scene: null
});

const BabylonResetSceneDispatchContext = createContext<
    BabylonResetSceneDispatch | undefined
>(undefined);

function BabylonProvider({ children }: BabylonProviderProps) {
    const canvas: HTMLCanvasElement | null = document.getElementById("renderCanvas") as HTMLCanvasElement; // Get the canvas element
    const _engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    const _scene = createScene(_engine, canvas);

    const [engine] = useState(_engine);
    const [scene, setScene] = useState(_scene);

    const resetSceneCallback = useCallback(() => {
        scene?.dispose();
        setScene(createScene(engine, canvas));
    }, [scene, engine, canvas, setScene]);

    useEffect(() => {
        engine.runRenderLoop(function () {
            scene?.render();
        });

        function handleWindowResize() {
            engine.resize();
        }

        // Watch for browser/canvas resize events
        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, [engine, scene]);

    return (
        <BabylonStateContext.Provider
            value={{
                engine,
                scene
            }}
        >
            <BabylonResetSceneDispatchContext.Provider
                value={resetSceneCallback}
            >
                {children}
            </BabylonResetSceneDispatchContext.Provider>
        </BabylonStateContext.Provider>
    );
}

function createScene(engine: BABYLON.Engine, canvas: HTMLElement | null) {
    if (engine == null || canvas == null) {
        return null;
    }

    const scene = new BABYLON.Scene(engine);
    scene.clearColor = BABYLON.Color4.FromHexString("#201c24");
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        15,
        new BABYLON.Vector3(0, 0, 0)
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 5;

    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(1, 1, 0),
        scene
    );

    return scene;
}

function useBabylonContext() {
    const context = useContext(BabylonStateContext);

    if (context === undefined) {
        throw new Error(
            "useBabylonState must be used within a BabylonProvider"
        );
    }

    return context;
}

function useBabylonResetSceneDispatch() {
    const context = useContext(BabylonResetSceneDispatchContext);

    if (context === undefined) {
        throw new Error(
            "useBabylonResetSceneDispatch must be used within a BabylonProvider"
        );
    }

    return context;
}

export {
    BabylonProvider,
    useBabylonContext,
    useBabylonResetSceneDispatch,
    BabylonStateContext
};
