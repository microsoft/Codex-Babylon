export const baseContext = `/* This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them */

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

/* Delete all the chairs */
state.chair0.dispose();
state.chair1.dispose();

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

/* delete all state */
state = {};
`;
