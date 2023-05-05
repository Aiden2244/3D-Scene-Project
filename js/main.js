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
    myScene.addObject(crateObject);

    const planeModelLocation = './models/Airplane/airplane.json';
    const planeTextureLocation = './models/Airplane/textures/diffuse.png';
    const planeObject = await renderModel(gl, program, planeModelLocation, planeTextureLocation);
    planeObject.scale([0.1, 0.1, 0.1]);
    myScene.addObject(planeObject);

    myScene.animate();
}


