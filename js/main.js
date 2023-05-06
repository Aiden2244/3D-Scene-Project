/**
 * Initializes a WebGL2 context, sets up a rendering program,
 * creates a scene, adds 3D objects to the scene, and then animates the scene.
 *
 * @async
 * @function myMain
 *
 * @returns {Promise<void>} A Promise that resolves when the animation is complete.
 */
async function myMain() {
    const gl = document.getElementById("canvas").getContext("webgl2");
    const program = await setup(gl);
    gl.useProgram(program);

    const myScene = new scene(gl, program);

    const crateModelLocation = './models/crate/crate.json';
    const crateTextureLocation = './models/crate/texture/simple_crate_tex.jpg';
    const crateObject = await renderModel(gl, program, crateModelLocation, crateTextureLocation);
    crateObject.translate([0.0, 0.0, -10.0]);
    // myScene.addObject(crateObject);

    const planeModelLocation = './models/Airplane/airplane.json';
    const planeTextureLocation = './models/Airplane/textures/diffuse.png';
    const planeNormalTextureLocation = './models/Airplane/textures/normal.png';
    const planeObject = await renderModel(gl, program, planeModelLocation, planeTextureLocation, planeNormalTextureLocation);
    planeObject.translate([0.0, -0.95, -4.0]);
    planeObject.rotate([0.0, 0.5, 0.0]);
    planeObject.scale([0.1, 0.1, 0.1]);
    // myScene.addObject(planeObject);

    const floorModelLocation = './models/cube.json';
    const floorObject = await renderModel(gl, program, floorModelLocation);
    floorObject.translate([0.0, -1.0, 0.0]);
    floorObject.scale([1000, 0.1, 1000]);
    floorObject.setColor([0.0, 1.0, 0.0]);
    // myScene.addObject(floorObject);

    const cubeModelLocation = floorModelLocation;
    const cubeObject = await renderModel(gl, program, cubeModelLocation, null, null, 'CubeMesh');
    // cubeObject.translate([0.0, 0.0, -10.0]);  
    myScene.addObject(cubeObject);


    myScene.animate();
}


