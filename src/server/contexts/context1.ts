export const baseContext = `/* This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them */

state = {};

/* Make a cube */
state.cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);

/* Move the cube up */
state.cube.position.y += 1

/* Move it to the left */
state.cube.position.x -= 1

/* Make the block teal */
state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);

/* Now make it spin */
state.spinningCube = setInterval(() => {
    scene.meshes[0].rotation.y += 0.02
}, 10)

/* Make it stop */
clearInterval(state.spinningCube)

/* Make it change color when the mouse is over it */
state.cube.actionManager = new BABYLON.ActionManager(scene);

state.hoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
});

state.unHoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
});

state.cube.actionManager.registerAction(state.hoverAction);
state.cube.actionManager.registerAction(state.unHoverAction);

/* Put a sphere on top of the cube */
state.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene)
state.sphere.position.y = 1

/* Delete the sphere and the cube */
state.sphere.dispose()
state.cube.dispose()

/* make 50 cubes side by side */
state.cubes = [];
for (let i = 0; i < 50; i++) {
    state.cubes[i] = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);
    state.cubes[i].position.x = i;
}

/* stack them like stairs */
for (let i = 0; i < 50; i++) {
    state.cubes[i].position.y = i;
}

/* remove them */
for (let i = 0; i < 50; i++) {
    state.cubes[i].dispose();
}

/* make the background red */
scene.clearColor = new BABYLON.Color3(1, 0, 0);
`;
