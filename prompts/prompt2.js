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
chairUrls = await getAssetUrls("chair");
if (chairAssets[0]) {
    console.log("url: ", chairAssets[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", chairUrls[0], scene);
    chair0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find chair asset");
}

/* try a different chair next to it*/
// Already have chair urls - no need to call getAssetUrls
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", chairUrls[1], scene);
chair1 = result.meshes[0];
chair1.position.x += 1;

/* Now make a third type in front of it! */
// Already have chair urls - no need to call getAssetUrls
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", chairUrls[2], scene);
chair2 = result.meshes[0];
chair2.position.z += 1;

/* Delete all the chairs */
chair0.dispose();
chair1.dispose();
chair2.dispose();

/* Help me troubleshoot */
scene.debugLayer.show();

/* Now hide it */
scene.debugLayer.hide();

/* Now make a lion */
// No primitive called lion - call external library
lionUrls = await getAssetUrls("lion");
if (lionUrls[0]) {
    console.log("lion url: ", lionUrls[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", lionUrls[0], scene);
    lion0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find lion asset");
}

/* Remove it */
lion0.dispose();

/* Create something spooky! */
// Ghosts are spooky
// No primitive called ghost - call external library
ghostUrls = await getAssetUrls("ghost");
if (ghostUrls[0]) {
    console.log("ghost url: ", ghostUrls[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", ghostUrls[0], scene);
    ghost0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find ghost asset");
}

/* get rid of the ghosts */
ghost0.dispose();

/* Create three sea creatures */
// Calling external library for a shark, octopus, and fish
sharkUrls = await getAssetUrls("shark");
if (sharkUrls[0]) {
    console.log("shark url: ", sharkUrls[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", sharkUrls[0], scene);
    shark0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find shark asset");
}

octopusUrls = await getAssetUrls("octopus");
if (octopusUrls[0]) {
    console.log("octopus url: ", octopusUrls[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", octopusUrls[0], scene);
    octopus0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find octopus asset");
}

fishUrls= await getAssetUrls("fish");
if (fishUrls[0]) {
    console.log("fish url: ", fishUrls[0]);
    result = await BABYLON.SceneLoader.ImportMeshAsync("", "", fishUrls[0], scene);
    fish0 = result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find fish asset");
}

/* delete them */
shark0.dispose();
octopus0.dispose();
fish0.dispose();

/* make url undefined */
url = undefined;
`;

module.exports = {
	basePrompt
};
