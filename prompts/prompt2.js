let basePrompt = `/* This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them */

/* Make the light more intense */
BABYLON.Engine.LastCreatedScene.lights[0].intensity = 10

/* Make the light less intense */
BABYLON.Engine.LastCreatedScene.lights[0].intensity = 1

/* Make a cube */
cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, BABYLON.Engine.LastCreatedScene);

/* Move the cube up */
cube.position.y += 1

/* Move it to the left */
cube.position.x -= 1

/* Make it change color when the mouse is over it */
cube.actionManager = new BABYLON.ActionManager(BABYLON.Engine.LastCreatedScene);

hoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
cube.material = new BABYLON.StandardMaterial("mat", BABYLON.Engine.LastCreatedScene);
cube.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
});

unHoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
cube.material = new BABYLON.StandardMaterial("mat", BABYLON.Engine.LastCreatedScene);
cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
});

cube.actionManager.registerAction(hoverAction);
cube.actionManager.registerAction(unHoverAction);

/* Make the block teal */
cube.material = new BABYLON.StandardMaterial("mat", BABYLON.Engine.LastCreatedScene);
cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);

/* Now make it spin */
spinningCube = setInterval(() => {
    BABYLON.Engine.LastCreatedScene.meshes[0].rotation.y += 0.02
}, 10)

/* Make it stop */
clearInterval(spinningCube)

/* Put a sphere on top of the cube */
sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, BABYLON.Engine.LastCreatedScene)
sphere.position.y = 1

/* create a series of larger and larger concentric torusses, like a tornado */
torus = BABYLON.MeshBuilder.CreateTorus("torus", {diameter: 1, thickness: 0.1}, BABYLON.Engine.LastCreatedScene);

torusArray = [];

for (let i = 0; i < 10; i++) {
    torusArray.push(BABYLON.MeshBuilder.CreateTorus("torus", {diameter: 1 + i, thickness: 0.1}, BABYLON.Engine.LastCreatedScene));
    torusArray[i].position.y = i;
}

/* Delete the sphere */
BABYLON.Engine.LastCreatedScene.meshes[1].dispose()

/* Delete the torusses */
for (let i = 0; i < torusArray.length; i++) {
    torusArray[i].dispose();
}
torusArray = null;

/* Create a chair! */
// No primitive called chair - call external library
url = await getAssetUrl("chair");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    chair = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find chair asset");
}

/* Make another next to it */
// Already have url - no need to call getAssetUrl
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
chair2 = result.meshes[0];
chair2.position.x += 0.5;
scene.createDefaultCamera(true, true, true);

/* Delete it now */
chair.dispose();

/* Help me troubleshoot */
scene.debugLayer.show();

/* Now hide it */
scene.debugLayer.hide();

/* Now make a lion */
// No primitive called lion - call external library
url = await getAssetUrl("lion");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    lion = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find lion asset");
}

/* Remove it */
lion.dispose();

/* Create something spooky! */
// Ghosts are spooky
// No primitive called ghost - call external library
url = await getAssetUrl("ghost");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    ghost = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find ghost asset");
}

/* get rid of the ghosts */
ghost.dispose();

/* Create three sea creatures */
// Calling external library for a shark, octopus, and fish
url = await getAssetUrl("shark");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    shark = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find shark asset");
}

url = await getAssetUrl("octopus");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    octopus = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find octopus asset");
}

url = await getAssetUrl("fish");
if (url) {
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
    fish = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find fish asset");
}

/* delete them */
shark.dispose();
octopus.dispose();
fish.dispose();

/* make url undefined */
url = undefined;
`;

module.exports = {
	basePrompt
};
