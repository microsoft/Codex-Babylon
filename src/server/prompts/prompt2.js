let basePrompt = `/* This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them */

/* make 50 cubes side by side */
state.cubes = [];
for (let i = 0; i < 50; i++) {
    state.cubes[i] = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, BABYLON.Engine.LastCreatedScene);
    state.cubes[i].position.x = i;
}

/* stack them like stairs */
for (let i = 0; i < 50; i++) {
    state.cubes[i].position.y = i;
}

/* delete them */
for (let i = 0; i < 50; i++) {
    state.cubes[i].dispose();
}

/* Help me troubleshoot */
scene.debugLayer.show();

/* Now hide it */
scene.debugLayer.hide();

/* Create a chair! */
// No primitive called chair - call external library
state.chairUrls = await getAssetUrls("chair");
if (state.chairUrls[0]) {
    console.log("url: ", state.chairUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.chairUrls[0], scene);
    state.chair0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find chair asset");
}

/* try a different chair next to it*/
// Already have chair urls - no need to call getAssetUrls
state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.chairUrls[1], scene);
state.chair1 = state.result.meshes[0];
state.chair1.position.x += 1;

/* Now make a third type in front of it! */
// Already have chair urls - no need to call getAssetUrls
state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.chairUrls[2], scene);
state.chair2 = state.result.meshes[0];
state.chair2.position.z += 1;

/* Delete all the chairs */
state.chair0.dispose();
state.chair1.dispose();
state.chair2.dispose();

/* Help me troubleshoot */
scene.debugLayer.show();

/* Now hide it */
scene.debugLayer.hide();

/* Now make a lion */
// No primitive called lion - call external library
state.lionUrls = await getAssetUrls("lion");
if (lionUrls[0]) {
    console.log("lion url: ", state.lionUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.lionUrls[0], scene);
    state.lion0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find lion asset");
}

/* Remove it */
state.lion0.dispose();

/* Create something spooky! */
// Ghosts are spooky
// No primitive called ghost - call external library
state.ghostUrls = await getAssetUrls("ghost");
if (state.ghostUrls[0]) {
    console.log("ghost url: ", state.ghostUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.ghostUrls[0], scene);
    state.ghost0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find ghost asset");
}

/* get rid of the ghosts */
state.ghost0.dispose();

/* Create three sea creatures */
// Calling external library for a shark, octopus, and fish
state.sharkUrls = await getAssetUrls("shark");
if (state.sharkUrls[0]) {
    console.log("shark url: ", sharkUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.sharkUrls[0], scene);
    state.shark0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find shark asset");
}

state.octopusUrls = await getAssetUrls("octopus");
if (state.octopusUrls[0]) {
    console.log("octopus url: ", state.octopusUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.octopusUrls[0], scene);
    state.octopus0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find octopus asset");
}

state.fishUrls= await getAssetUrls("fish");
if (state.fishUrls[0]) {
    console.log("fish url: ", state.fishUrls[0]);
    state.result = await BABYLON.SceneLoader.ImportMeshAsync("", "", state.fishUrls[0], scene);
    state.fish0 = state.result.meshes[0];
    scene.createDefaultCamera(true, true, true);
} else {
    console.log("Could not find fish asset");
}

/* delete them */
state.shark0.dispose();
state.octopus0.dispose();
state.fish0.dispose();

`;

module.exports = {
	basePrompt
};
