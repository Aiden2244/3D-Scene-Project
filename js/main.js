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

    // blank normal map (preventing issues on some operating systems)
    const blankNormalMap = './models/blankNormalMap.png'

    // crate
    const crateModelLocation = './models/crate/crate.json';
    const crateTextureLocation = './models/crate/texture/simple_crate_tex.jpg';
    const crateObject = await renderModel(gl, program, crateModelLocation, crateTextureLocation, blankNormalMap, ['crate1', 'crate2', 'crate3']);
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
    const turbineObject = await renderModel(gl, program, turbineModelLocation, blankNormalMap, blankNormalMap, null);
    turbineObject.translate([7.0, 6.0, -12.0]);
    turbineObject.rotate([0, 0.5, 0])
    myScene.addObject(turbineObject);

    // turbine windmill head
    turbineHeadModelLocation = './models/Turbine/turbine_head.json';
    const turbineHeadObject = await renderModel(gl, program, turbineHeadModelLocation, blankNormalMap, blankNormalMap, ['fan']);
    turbineHeadObject.translate([7.0, 6.0, -12.0]);
    turbineHeadObject.rotate([0, 0.5, 0])
    myScene.addObject(turbineHeadObject);

    // floor for the world
    const floorModelLocation = './models/cube.json';
    const floorObject = await renderModel(gl, program, floorModelLocation, blankNormalMap, blankNormalMap, null);
    floorObject.translate([5.0, -1.0, 5.0]);
    floorObject.rotate([0, 0, 0]);
    floorObject.scale([10000, 0.1, 10000]);
    floorObject.setColor([0.0, 1.0, 0.0]);
    floorObject.setMaterialProperties([0.6, 0.6, 0.6], [0.0, 1.0, 0.0], [1.0, 1.0, 1.0], 240);
    myScene.addObject(floorObject);

    // reflective box
    const cubeModelLocation = floorModelLocation;
    const cubeObject = await renderModel(gl, program, cubeModelLocation, null, null, ['CubeMesh', 'CubeMesh2']);
    cubeObject.translate([4.0, 1.0, 6.0]);
    cubeObject.setMaterialProperties([0.3, 0.3, 0.3], [0.8, 0.8, 0.0], [1.0, 1.0, 0.0], 8)
    myScene.addObject(cubeObject);

    // flag
    const flagModelLocation = './models/Flagpole/flag.json';
    const flagTextureLocation = './models/Flagpole/textures/red.jpg';
    const flagObject = await renderModel(gl, program, flagModelLocation, flagTextureLocation, blankNormalMap, ['flag']);
    flagObject.translate([10, 6.0, 12.0]);
    flagObject.rotate([0, -1, 0]);
    flagObject.scale([0.4, 0.4, 0.4]);
    myScene.addObject(flagObject);

    const flagObject2 = await renderModel(gl, program, flagModelLocation, flagTextureLocation, blankNormalMap, ['flag']);
    flagObject2.translate([10, 6.0, 12.0]);
    flagObject2.rotate([0, -1.2, 0]);
    flagObject2.scale([-0.4, 0.4, -0.4]);
    myScene.addObject(flagObject2);

    // flag pole
    const flagPoleModelLocation = './models/Flagpole/pole.json';
    const flagPoleTextureLocation = './models/Flagpole/textures/WOOD05L2.jpg';
    const flagPoleObject = await renderModel(gl, program, flagPoleModelLocation, flagPoleTextureLocation, blankNormalMap, ['pole']);
    flagPoleObject.translate([10, 9.15, 12]);
    flagPoleObject.rotate([Math.PI, 0, 0]);
    flagPoleObject.scale([0.5, 0.5, 0.5]);
    myScene.addObject(flagPoleObject);

    // house
    const houseModelLocation = './models/House/house.json';
    const houseTextureLocation = flagPoleTextureLocation;
    const houseObject = await renderModel(gl, program, houseModelLocation, houseTextureLocation, blankNormalMap, null);
    houseObject.translate([10, -1.0, 12]);
    houseObject.rotate([0, -1.5, 0]);
    houseObject.scale([1.5, 1.5, 1.5]);
    myScene.addObject(houseObject);

    // stonehenge
    const stonehengeModelLocation = './models/Stonehenge/stonehenge.json';
    const stonehengeTextureLocation = './models/Stonehenge/rock.png';
    const stonehengeObject1 = await renderModel(gl, program, stonehengeModelLocation, stonehengeTextureLocation, blankNormalMap, null);
    stonehengeObject1.translate([0.01*Math.sin(0), 0, 0.01*Math.cos(0)]);
    stonehengeObject1.rotate([0, Math.sin(0) + Math.cos(0), 0]);
    stonehengeObject1.scale([0.5, 0.5, 0.5]);
    myScene.addObject(stonehengeObject1);

    const stonehengeObject2 = await renderModel(gl, program, stonehengeModelLocation, stonehengeTextureLocation, blankNormalMap, null);
    stonehengeObject2.translate([0.01*Math.sin(Math.PI/4), 0, 0.01*Math.cos(Math.PI/4)]);
    stonehengeObject2.rotate([0, Math.sin(Math.PI/4) + Math.cos(Math.PI/4), 0]);
    stonehengeObject2.scale([0.5, 0.5, 0.5]);
    myScene.addObject(stonehengeObject2);

    const stonehengeObject4 = await renderModel(gl, program, stonehengeModelLocation, stonehengeTextureLocation, blankNormalMap, null);
    stonehengeObject4.translate([0.01*Math.sin(3*Math.PI/4), 0, 0.01*Math.cos(3*Math.PI/4)]);
    stonehengeObject4.rotate([0, Math.sin(3*Math.PI/4) + Math.cos(3*Math.PI/4), 0]);
    stonehengeObject4.scale([0.5, 0.5, 0.5]);
    myScene.addObject(stonehengeObject4);

    const stonehengeObject5 = await renderModel(gl, program, stonehengeModelLocation, stonehengeTextureLocation, blankNormalMap, null);
    stonehengeObject5.translate([0.01*Math.sin(Math.PI), 0, 0.01*Math.cos(Math.PI)]);
    stonehengeObject5.rotate([0, Math.sin(Math.PI) + Math.cos(Math.PI), 0]);
    stonehengeObject5.scale([0.5, 0.5, 0.5]);
    myScene.addObject(stonehengeObject5);

    const stonehengeObject6 = await renderModel(gl, program, stonehengeModelLocation, stonehengeTextureLocation, blankNormalMap, null);
    stonehengeObject6.translate([0.01*Math.sin(5*Math.PI/4), 0, 0.01*Math.cos(5*Math.PI/4)]);
    stonehengeObject6.rotate([0, Math.sin(5*Math.PI/4) + Math.cos(5*Math.PI/4), 0]);
    stonehengeObject6.scale([0.5, 0.5, 0.5]);
    myScene.addObject(stonehengeObject6);

    // animate the scene
    myScene.animate();
}


