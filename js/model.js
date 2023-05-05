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
 *
 * @returns {Promise<object>} A Promise that resolves with the rendered 3D model.
 */
async function renderModel(gl, program, modelUrl, textureUrl) {
    const ModelMaterialsArray = [];
    const ModelAttributeArray = [];

    await loadExternalJSON(modelUrl, ModelMaterialsArray, ModelAttributeArray);

    const modelTexture = await loadImageAsTexture(gl, textureUrl);
    const model = new shape(gl, program);
    model.loadAttributes(ModelAttributeArray, 0);
    model.loadMaterial(ModelMaterialsArray, ModelAttributeArray[0].materialIndex);
    model.setTexture(modelTexture);

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

/**
 * Extracts the materials from a 3D model in JSON format and stores them in the specified ModelMaterialsArray.
 *
 * @function createMaterialsArray
 *
 * @param {JSON} obj2 - The 3D model in JSON format.
 * @param {Array} ModelMaterialsArray - An array to store the extracted materials data.
 */
function createMaterialsArray(obj2, ModelMaterialsArray) {
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