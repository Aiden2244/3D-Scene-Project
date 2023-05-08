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

    // initialize context and program
    const gl = document.getElementById("canvas").getContext("webgl2");
    const program = await setup(gl);
    gl.useProgram(program);

    // make scene
    const myScene = new scene(gl, program);

    // crate
    const crateModelLocation = './models/crate/crate.json';
    const crateTextureLocation = './models/crate/texture/simple_crate_tex.jpg';
    const crateObject = await renderModel(gl, program, crateModelLocation, crateTextureLocation, null, ['crate1', 'crate2', 'crate3']);
    crateObject.translate([-3.0, 1.0, 3.0]);
    myScene.addObject(crateObject);

    // plane
    const planeModelLocation = './models/Airplane/airplaneBody.json';
    const planeTextureLocation = './models/Airplane/textures/diffuse.png';
    const planeNormalTextureLocation = './models/Airplane/textures/normal.png';
    const planeObject = await renderModel(gl, program, planeModelLocation, planeTextureLocation, planeNormalTextureLocation, ['plane']);
    planeObject.translate([-2, 6, -8]);
    planeObject.rotate([0, 0.5, 0])
    planeObject.scale([0.1, 0.1, 0.1]);
    myScene.addObject(planeObject);

    // plane propeller
    const propellerModelLocation = './models/Airplane/propeller.json';
    const propellerTextureLocation = './models/Airplane/textures/diffuse.png';
    const propellerNormalTextureLocation = './models/Airplane/textures/normal.png';
    const propellerObject = await renderModel(gl, program, propellerModelLocation, propellerTextureLocation, propellerNormalTextureLocation, ['propeller']);
    propellerObject.translate([-2, 6, -8]);
    propellerObject.rotate([0, 0.5, 0])
    propellerObject.scale([0.1, 0.1, 0.1]);
    myScene.addObject(propellerObject);

    // turbine pole
    const turbineModelLocation = './models/Turbine/turbine_body.json';
    const turbineObject = await renderModel(gl, program, turbineModelLocation, null, null, null);
    turbineObject.translate([7.0, 6.0, -12.0]);
    turbineObject.rotate([0, 0.5, 0])
    myScene.addObject(turbineObject);

    // turbine windmill head
    turbineHeadModelLocation = './models/Turbine/turbine_head.json';
    const turbineHeadObject = await renderModel(gl, program, turbineHeadModelLocation, null, null, ['fan']);
    turbineHeadObject.translate([7.0, 6.0, -12.0]);
    turbineHeadObject.rotate([0, 0.5, 0])
    myScene.addObject(turbineHeadObject);

    // floor for the world
    const floorModelLocation = './models/cube.json';
    const floorObject = await renderModel(gl, program, floorModelLocation, null, null, null);
    floorObject.translate([5.0, -1.0, 5.0]);
    floorObject.rotate([0, 0, 0]);
    floorObject.scale([10000, 0.1, 10000]);
    floorObject.setColor([1.0, 1.0, 1.0]);
    floorObject.setMaterialProperties([1.0, 1.0, 1.0], [0.0, 1.0, 0.0], null, 0);
    myScene.addObject(floorObject);

    // reflective box
    const cubeModelLocation = floorModelLocation;
    const cubeObject = await renderModel(gl, program, cubeModelLocation, null, null, ['CubeMesh', 'CubeMesh2']);
    cubeObject.translate([5.0, 0.0, -5.0]);
    cubeObject.rotate([0, 0, Math.PI]);  
    myScene.addObject(cubeObject);

    const flagModelLocation = './models/Flagpole/flag.json';
    const flagTextureLocation = './models/Flagpole/textures/red.jpg';
    const flagObject = await renderModel(gl, program, flagModelLocation, flagTextureLocation, null, ['flag']);
    flagObject.translate([4.0, 4.0, -25.0]);
    flagObject.rotate([0, 0, 0]);
    flagObject.scale([0.5, 0.5, 0.5]);
    myScene.addObject(flagObject);

    const flagPoleModelLocation = './models/Flagpole/pole.json';
    const flagPoleTextureLocation = './models/Flagpole/textures/WOOD05L2.jpg';
    const flagPoleObject = await renderModel(gl, program, flagPoleModelLocation, flagPoleTextureLocation, null, ['pole']);
    flagPoleObject.translate([4.0, -2, -25.0]);
    flagPoleObject.rotate([0, 0, 0]);
    flagPoleObject.scale([0.5, 0.5, 0.5]);
    myScene.addObject(flagPoleObject);



    myScene.animate();
}


