export const promptDescription = "This document contains a BabylonJS scene, natural language commands and the BabylonJS code needed to accomplish them";

export const promptExamples = [
    {
        input: `Initial state`,
        response: `state = {};`
    },
    {
        input: `Make a cube`,
        response: `state.cube = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);`
    }, 
    {
        input: `Move the cube up`,
        response: `state.cube.position.y += 1;`
    },
    {
        input: `Move it to the left`,
        response: `state.cube.position.x -= 1;`
    },
    {
        input: `Make the block teal`,
        response: `state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);`
    },
    {
        input: `Now make it spin`,
        response: `state.intervals["spinningCubeInterval"] = setInterval(() => {
    scene.meshes[0].rotation.y += 0.02
}, 10);`
    },
    {
        input: `Make it stop`,
        response: `clearInterval(state.intervals.spinningCubeInterval);`
    },
    {
        input: `Make it change color when the mouse is over it`,
        response: `state.cube.actionManager = new BABYLON.ActionManager(scene);
state.hoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
});
state.unHoverAction = new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function () {
state.cube.material = new BABYLON.StandardMaterial("mat", scene);
state.cube.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
});
state.cube.actionManager.registerAction(state.hoverAction);
state.cube.actionManager.registerAction(state.unHoverAction);`
    }, 
    {
        input: `Put a sphere on top of the cube`,
        response: `state.sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 1}, scene);
state.sphere.position.y = 1;`
    },
    {
        input: `Delete the sphere and the cube`,
        response: `state.sphere.dispose();
state.cube.dispose();`
    },
    {
        input: `make 50 cubes side by side`,
        response: `state.cubes = [];
for (let i = 0; i < 50; i++) {
    state.cubes[i] = BABYLON.MeshBuilder.CreateBox("cube", {size: 1}, scene);
    state.cubes[i].position.x = i;
}`
    },
    {
        input: `stack them like stairs`,
        response: `for (let i = 0; i < 50; i++) {
    state.cubes[i].position.y = i;
}`
    },
    {
        input: `remove them`,
        response: `for (let i = 0; i < 50; i++) {
    state.cubes[i].dispose();
}`
    },
    {
        input: `make the background red`,
        response: `scene.clearColor = new BABYLON.Color3(1, 0, 0);`
    }
];

