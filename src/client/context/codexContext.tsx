import React from "react";
import { useCallback } from "react";

// TODO: Add type definition.
type CodexState = {
    state: any;
};
type CodexResetStateDispatch = () => void;
type CodexStateProviderProps = { children?: React.ReactNode };

const CodexStateContext = React.createContext<any>({});
const CodexResetStateDispatchContext = React.createContext<
    CodexResetStateDispatch | undefined
>(undefined);

/**
 * Codex state context provider.
 * Currently provide:
 *     1) Codex state,
 *     2) dispatch function to reset state.
 */
function CodexStateProvider({ children }: CodexStateProviderProps) {
    const [state, setState] = React.useState({});

    const resetStateCallback = useCallback(() => setState({}), [setState]);

    return (
        <CodexStateContext.Provider value={{ state }}>
            <CodexResetStateDispatchContext.Provider value={resetStateCallback}>
                {children}
            </CodexResetStateDispatchContext.Provider>
        </CodexStateContext.Provider>
    );
}

function useCodexStateContext() {
    const context = React.useContext(CodexStateContext);

    if (context === undefined) {
        throw new Error(
            "useCodexStateContext must be used within a CodexStateProvider"
        );
    }

    return context;
}

function useCodexResetStateDispatch() {
    const context = React.useContext(CodexResetStateDispatchContext);

    if (context === undefined) {
        throw new Error(
            "useCodexResetStateDispatch must be used within a CodexStateProvider"
        );
    }

    return context;
}

export {
    CodexStateProvider,
    useCodexStateContext,
    useCodexResetStateDispatch,
    CodexStateContext
};
