let basePrompt = `/* This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them */

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
        scene.render();
});

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

/* delete it */
cube.dispose()

/* Create a chair! */
// No primitive called chair - calling external library
url = await getAssetUrl("chair");
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
chair = result.meshes[0];
scene.createDefaultCamera(true, true, true);

/* Delete it now */
chair.dispose();

/* Help me troubleshoot */
scene.debugLayer.show();

/* Now hide it */
scene.debugLayer.hide();

/* Now make a lion */
// No primitive called lion - calling external library
url = await getAssetUrl("lion");
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
lion = result.meshes[0];
scene.createDefaultCamera(true, true, true);

/* Delete it now */
lion.dispose();

/* Create the thing that beats scissors */
// Rock beats scissors
// No primitive called rock - calling external library
url = await getAssetUrl("rock");
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
rock = result.meshes[0];
scene.createDefaultCamera(true, true, true);

/* Delete it now */
rock.dispose();

/* now make the thing that beats paper */
// Scissors beat paper
// No primitive called scissors - calling external library
url = await getAssetUrl("scissors");
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
scissors = result.meshes[0];
scene.createDefaultCamera(true, true, true);

/* remove it */
scissors.dispose();

/* create something that an elephant is scared of */
// An elephant is scared of mice
// No primitive called mouse - calling external library
url = await getAssetUrl("mouse");
result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene);
mouse = result.meshes[0];
scene.createDefaultCamera(true, true, true);
`;

module.exports = {
	basePrompt
};
