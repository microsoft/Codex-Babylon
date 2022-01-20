const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

// BABYLON CODE

const createScene = function () {

	const scene = new BABYLON.Scene(engine);
	const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
	camera.attachControl(canvas, true);
	camera.wheelPrecision = 5;

	const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

	return scene;
};

const scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});

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
			document.getElementById("codeView").innerText = data.code;
			command.innterText = "";
			evalAsync(data.code);
		})
		.catch(error => console.error(error));
};

const reset = function () {
	document.getElementById("codeView").innerText = "";
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
    return data.text;
};

const evalAsync = async function (code) {
    await eval("(async () => { " + code + "})()");
}