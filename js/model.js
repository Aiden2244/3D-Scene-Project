/**
 * Loads and renders a 3D model with texture, given the model and texture URLs, WebGL context, and rendering program.
 *
 * @async
 * @function renderModel
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 * @param {WebGLProgram} program - The rendering program.
 * @param {string} modelUrl - The URL of the 3D model.
 * @param {string} textureUrl - The URL of the texture.
 * @param {string} normalTextureUrl - The URL of the normal texture.
 * @param {string[]} names - The list of names of the object transformations.
 *
 * @returns {Promise<object>} A Promise that resolves with the rendered 3D model.
 */
async function renderModel(gl, program, modelUrl, textureUrl, normalTextureUrl, names) {
    // initialize arrays to store the model data
    const ModelMaterialsArray = [];
    const ModelAttributeArray = [];

    // load the model data from the external JSON file
    await loadExternalJSON(modelUrl, ModelMaterialsArray, ModelAttributeArray);

    // create a new shape object and load the model data into it
    const model = new shape(gl, program);
    model.loadAttributes(ModelAttributeArray, 0);
    model.loadMaterial(ModelMaterialsArray, ModelAttributeArray[0].materialIndex);
    
    // load the texture and normal texture
    if (textureUrl) {
        const modelTexture = await loadImageAsTexture(gl, textureUrl);
        model.setTexture(modelTexture);
    }
    if (normalTextureUrl) {
        const normalTexture = await loadImageAsTexture(gl, normalTextureUrl);
        model.setNormalMap(normalTexture);
    }

    // load the transformations
    if (names) {
        const objectJSON = await fetch(modelUrl).then(resp => resp.json());
        for (let i = 0; i < names.length; i++) {
            model.transformations = extractTransformations(objectJSON, names);
        }
    }

    return model;
}

/**
 * Loads an external JSON file and stores its data in the specified arrays.
 *
 * @function loadExternalJSON
 *
 * @param {string} url - The URL of the external JSON file.
 * @param {Array} ModelMaterialsArray - An array to store the extracted materials data.
 * @param {Array} ModelAttributeArray - An array to store the extracted attributes data.
 *
 * @returns {Promise<void>} A Promise that resolves when the external JSON file has been loaded and its data has been stored in the specified arrays.
 */
function loadExternalJSON(url, ModelMaterialsArray, ModelAttributeArray) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then((resp) => {
                if (resp.ok)
                    return resp.json();
                throw new Error(`Could not get ${url}`);
            })
            .then(function (ModelInJson) {
                createMaterialsArray(ModelInJson, ModelMaterialsArray);
                createModelAttributeArray(ModelInJson, ModelAttributeArray);
                resolve();
            })
            .catch(function (error) {
                alert(error);
                console.log(error);
                reject(error);
            });
    });
}


/**
 * Extracts the attributes from a 3D model in JSON format and stores them in the specified ModelAttributeArray.
 *
 * @function createModelAttributeArray
 *
 * @param {JSON} obj2 - The 3D model in JSON format.
 * @param {Array} ModelAttributeArray - An array to store the extracted attributes data.
 */
function createModelAttributeArray(obj2, ModelAttributeArray) {
    let numMeshIndexs = obj2.meshes.length;

    // Loop through all the meshes in the model
    for (let idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        // Extract the vertices, normals, texture coordinates, indices, and material index from the mesh
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

/**
 * Extracts the materials from a 3D model in JSON format and stores them in the specified ModelMaterialsArray.
 *
 * @function createMaterialsArray
 *
 * @param {JSON} obj2 - The 3D model in JSON format.
 * @param {Array} ModelMaterialsArray - An array to store the extracted materials data.
 */
function createMaterialsArray(obj2, ModelMaterialsArray) {
    let itr = obj2.materials.length;

    // Loop through all the materials in the model
    for (let idx = 0; idx < itr; idx++) {
        let met = {};

        // Extract the material properties from the material
        let materialProperties = obj2.materials[idx].properties;
        let materialPropsObj = {};

        materialProperties.forEach(prop => {
            materialPropsObj[prop.key] = prop.value;
        });

        // Store the material properties in the met object
        met.shadingm = materialPropsObj["$mat.shadingm"];
        met.ambientm = materialPropsObj["$clr.ambient"];
        met.diffusem = materialPropsObj["$clr.diffuse"];
        met.specularm = materialPropsObj["$clr.specular"];
        met.shininess = materialPropsObj["$mat.shininess"];

        ModelMaterialsArray.push(met);
    }
}


/**
 * Extracts the transformations from a 3D model in JSON format and stores them in an array.
 *
 * @function extractTransformations
 *
 * @param {JSON} modelJson - The 3D model in JSON format.
 * @param {string} objectName - The name of the object to extract the transformations for.
 *
 * @returns {Array} An array containing the extracted transformation data.
 */
function extractTransformations(modelJson, objectNames) {
    // Initialize the array to store the transformations
    const transformations = [];

    // Check if the rootnode and children property exists in the modelJson
    if (!modelJson.hasOwnProperty('rootnode') || !modelJson.rootnode.hasOwnProperty('children')) {
        console.error(`The 'children' property is not found in the JSON file.`);
        return transformations;
    }

    // Loop through all the object names
    for (let i = 0; i < objectNames.length; i++) {
        // Search for the object node in the JSON
        const objectNode = modelJson.rootnode.children.find(child => child.name === objectNames[i]);

        if (!objectNode) {
            console.error(`Object with name '${objectNames[i]}' not found in the JSON file.`);
            return transformations;
        }

        // Directly push the content of the 'transformation' property
        if (objectNode.hasOwnProperty('transformation')) {
            transformations.push(objectNode.transformation);
        } else {
            console.error(`Transformation not found for object with name '${objectNames[i]}'.`);
        }
    }

    return transformations;
}
