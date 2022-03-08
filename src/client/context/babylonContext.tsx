import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
    useRef
} from "react";

// temp workaround to deal with the global variable of babylon CDN
interface customWindow extends Window {
    BABYLON?: any;
}

declare const window: customWindow;

type BabylonProviderProps = {
    children?: ReactNode;
};

export type BabylonResetSceneDispatch = () => void;

// TODO: Add type definition.
type BabylonContext = {
    engine: any;
    scene: any;
};

const BabylonStateContext = createContext<BabylonContext>({
    engine: null,
    scene: null
});

const BabylonResetSceneDispatchContext = createContext<
    BabylonResetSceneDispatch | undefined
>(undefined);

function BabylonProvider({ children }: BabylonProviderProps) {
    const canvas: HTMLElement | null = document.getElementById("renderCanvas"); // Get the canvas element
    const _engine = new window.BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
    const _scene = createScene(_engine, canvas);

    const [engine] = useState(_engine);
    const [scene, setScene] = useState(_scene);

    const resetSceneCallback = useCallback(() => {
        scene.dispose();
        setScene(createScene(engine, canvas));
    }, [scene, engine, canvas, setScene, createScene]);

    function handleWindowResize() {
        engine.resize();
    }

    useEffect(() => {
        engine.runRenderLoop(function () {
            scene.render();
        });
        
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

function createScene(engine: any, canvas: HTMLElement | null) {
    if (engine == null || canvas == null) {
        return null;
    }

    const scene = new window.BABYLON.Scene(engine);
    scene.clearColor = new window.BABYLON.Color3.FromHexString("#201c24");
    const camera = new window.BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        15,
        new window.BABYLON.Vector3(0, 0, 0)
    );
    camera.attachControl(canvas, true);
    camera.wheelPrecision = 5;

    const light = new window.BABYLON.HemisphericLight(
        "light",
        new window.BABYLON.Vector3(1, 1, 0)
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
