import React from "react";
import Form from "./components/Form";
import "./App.css";
import { BabylonProvider } from "./context/babylonContext";
import { CodexStateProvider } from "./context/codexContext";
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

export default function App() {
    return (
        <BabylonProvider>
            <CodexStateProvider>
                <Form />
            </CodexStateProvider>
        </BabylonProvider>
    );
}
