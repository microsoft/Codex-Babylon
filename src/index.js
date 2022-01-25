const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const monaco = require('monaco-editor');

// BABYLON CODE

const createScene = function () {

	const scene = new BABYLON.Scene(engine);
	const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
	camera.attachControl(canvas, true);
	camera.wheelPrecision = 5;

	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

	return scene;
};

const codeParent = document.getElementById('codeDiv');
const showCodeButton = document.getElementById('showCodeButton');
const resetButton = document.getElementById('resetButton');
const submitButton = document.getElementById('submitButton');

const editor = monaco.editor.create(codeParent, {
	value: "function hello() {\n\talert('Hello world!');\n}",
	language: 'javascript',
	scrollBeyondLastLine: false,
	wordWrap: 'wordWrapColumn',
	wordWrapColumn: 80,
	wrappingIndent: 'indent',
	readOnly: true,
});

const scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});

const hiddenClassName = "hidden";

const displayCode = function () {
	if(codeParent.classList.contains(hiddenClassName)) {
		codeParent.classList.remove(hiddenClassName);
		console.log(
			"Showing codeDiv element"
		);
	}
	else {
		codeParent.classList.add(hiddenClassName);
		console.log(
			"Hiding codeDiv element"
		);
	}
}

// CODEX CODE (calls the Express Server)

const sendCommand = function () {
	const command = document.getElementById("commandInput").value;
	console.log(
		"Sending command: " + command
	);

	fetch(`http://localhost:1018/codegen`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({
				text: command
			})
		}).then(response => response.json())
		.then(data => {
			console.log(data.code);
			editor.setValue(data.code)
			command.innterText = "";
			evalAsync(data.code);
		})
		.catch(error => console.error(error));
};

const reset = function () {
	editor.setValue('')
	fetch("http://localhost:1018/reset")
		.then(response => response.json())
		.then(res => {
			console.log(res);
		})
		.catch(error => console.error(error));
};

// Get the asset URL for the given asset name
const getAssetUrl = async function (asset) {
	const response = await fetch(`http://localhost:1018/assetUrls?text=${asset}`);
	const data = await response.json();
	if (data.text.length > 0) {
		return data.text;
	} else {
		return null;
	}
};

const evalAsync = async function (code) {
	await eval("(async () => { " + code + "})()");
}

showCodeButton.onclick = displayCode;
resetButton.onclick = reset;
submitButton.onclick = sendCommand;