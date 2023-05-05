let obj; // used for debugging in web-browser console

let ModelMaterialsArray = []; // an array of materials
let ModelAttributeArray = []; // vertices, normals, textcoords, uv


/**
 * Entry Point for HTML <body onload() >
 * Uses Asynchronous HTTP request to load 3D Mesh Model in JSON format
 * 
 */

async function myMain() {

    /**
    *   Load external model. The model is stored in
        two Arrays
            * ModelMaterialsArray[]
                each index has set material of uniforms for a draw call
                {ambient, diffuse, specular, ...}

            * ModelAttributeArray[]
                each index contains set of attributes for a draw call
                {vertices, normals, texture coords, indices and materialindex number}

                the materialindex number specifies which index in the ModelMaterialsArray[]
                has the illumination uniforms for this draw call

    */

    // uri is relative to directory containing HTML page
    await loadExternalJSON('./models/crate/crate.json');

    // gl context
    const gl = document.getElementById("canvas").getContext("webgl2");

    // create program
    const program = await setup(gl);
    gl.useProgram(program);

    // create the scene
    const myScene = new scene(gl, program);

    // load texture
    const crateTexture = await loadImageAsTexture(gl, "./models/crate/texture/simple_crate_tex.jpg");    

    // create the crate
    const crate = new shape(gl, program);
    crate.translate([0, 5, 0]);
    crate.loadAttributes(ModelAttributeArray, 0);
    crate.loadMaterial(ModelMaterialsArray, ModelAttributeArray[0].materialIndex);
    crate.setTexture(crateTexture);

    // add crate to scene
    myScene.addObject(crate);


    // oh boy let's load the plane in
    await loadExternalJSON('./models/Airplane/airplane.json');

    // load the plane texture
    const planeTexture = await loadImageAsTexture(gl, "./models/Airplane/textures/normal.png");

    // let's make a plane
    const plane = new shape(gl, program);
    plane.loadAttributes(ModelAttributeArray, 1);
    plane.loadMaterial(ModelMaterialsArray, ModelAttributeArray[1].materialIndex);
    plane.setTexture(planeTexture);
    plane.scale([0.1, 0.1, 0.1]);
    //plane.translate([0, -8, -10]);

    // add plane to scene
    myScene.addObject(plane);


    // animate
    myScene.animate();
    

    console.log("ModelAttributeArray: ");
    console.log(ModelAttributeArray);
    console.log(ModelAttributeArray.length);

    console.log("ModelMaterialsArray: ");
    console.log(ModelMaterialsArray);
    console.log(ModelMaterialsArray.length);

    console.log("ModelAttributeArray[0].indices.length: ");
    console.log(ModelAttributeArray[0].indices.length);
}


/**
 * @function createModelAttributeArray - Extracts the Attributes from JSON and stores them in ModelAttribute Array
 * attributes include {vertices, normals, indices, and texture coordinates}
 * 
 * @param {JSON} obj2 3D Model in JSON Format
 */
function createModelAttributeArray(obj2) {
    console.log('In createModelAttributeArray...');
    console.log(obj2.meshes.length);

    let numMeshIndexs = obj2.meshes.length;
    let idx = 0;
    for (idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        modelObj.vertices = obj2.meshes[idx].vertices;
        modelObj.normals = obj2.meshes[idx].normals;

        if (obj2.meshes[idx].hasOwnProperty('texturecoords')) {
            modelObj.textureCoords = obj2.meshes[idx].texturecoords[0];
        }

        modelObj.indices = obj2.meshes[idx].faces.flat();
        modelObj.materialIndex = obj2.meshes[idx].materialindex;

        ModelAttributeArray.push(modelObj);
    }
}

function createMaterialsArray(obj2) {
    console.log('In createMaterialsArray...');
    console.log(obj2.materials.length);

    let itr = obj2.materials.length;
    let idx = 0;

    for (idx = 0; idx < itr; idx++) {
        let met = {};

        let materialProperties = obj2.materials[idx].properties;
        let materialPropsObj = {};

        materialProperties.forEach(prop => {
            materialPropsObj[prop.key] = prop.value;
        });

        met.shadingm = materialPropsObj["$mat.shadingm"];
        met.ambientm = materialPropsObj["$clr.ambient"];
        met.diffusem = materialPropsObj["$clr.diffuse"];
        met.specularm = materialPropsObj["$clr.specular"];
        met.shininess = materialPropsObj["$mat.shininess"];

        ModelMaterialsArray.push(met);
    }
}



// load an external object using 
// newer fetch() and promises
// input is url for requested object
// 

/**
 * loadExternalJson - Loads a 3D Model (in JSON Format)
 *  1. request json file from server
 *  2. call createMaterialsArray 
 *     Populates JavaScript array with Model Materials {ambient, diffuse, shiniess, and textures}
 * 
 *  3. call crateModelAttributeArray
 *     Populates JavaScript array with Model Attributes {vertices, normals, textCoords, }
 * 
 *  4. call setUpWebGL
 *     create WebGL context
 *     Creates and binds buffers
 *     rendering loop
 * 
 * @param {uri} url -- the uri for the 3D Model to load. File should be a JSON format
 * @returns {Promise} -- a promise that resolves when the 3D Model is loaded
 */
function loadExternalJSON(url) {
    return new Promise ((resolve, reject) => {
        fetch(url)
            .then((resp) => {
                // if the fetch does not result in an network error
                if (resp.ok)
                    return resp.json(); // return response as JSON
                throw new Error(`Could not get ${url}`);
            })
            .then(function (ModelInJson) {
                // get a reference to JSON mesh model for debug or other purposes 
                obj = ModelInJson;
                createMaterialsArray(ModelInJson);
                createModelAttributeArray(ModelInJson);
                resolve();
            })
            .catch(function (error) {
                // error retrieving resource put up alerts...
                alert(error);
                console.log(error);
                reject(error);
            });
        });
}