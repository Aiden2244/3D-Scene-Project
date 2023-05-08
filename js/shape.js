/* SHAPE CLASS */
/**
 * @class shape
 * 
 * @classdesc A shape represents a single object in the scene. It contains all the information 
 * needed to render the object, including its model matrix, color, and texture.
 *
 */
class shape {
    /**
     * The constructor for the shape class.
     * @constructor
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL2 context. 
     * @param {WebGLProgram} program - The WebGL program. 
     */
    constructor(gl, program) {
        // pass values for the gl context and program
        this.gl = gl; 
        this.program = program; 

        // set the default material values for the shape
        this.color = [1, 1, 1]; 
        this.diffuseLight = [0.8, 0.8, 0.8]; 
        this.ambientLight = [0.2, 0.2, 0.2]; 
        this.specularLight = [0.5, 0.5, 0.5];
        this.shininess = 72; 

        // create the shape's model matrix
        this.modelMatrix = glMatrix.mat4.create(); // each shape has its own model matrix

        // set the default values for the shape's texture and normal map
        this.texture = null;
        this.normalMap = null;

        // initialize the transformations array
        this.transformations = [];

        // initialize the shape's data arrays
        this.vertices = [];
        this.normals = [];
        this.textureCoords = [];
        this.indices = [];

        // initialize the shape's buffers
        this.positionBuffer;
        this.normalBuffer;
        this.textureCoordBuffer;
        this.indexBuffer;
    }
    /******/

    /* MODEL MATRIX FUNCTIONS */

    /**
     * Translates the shape by the given vector.
     * @method translate
     * 
     * @param {vec3} translationVector - The vector by which to translate the shape.
     * @returns {void}
     */
    translate(translationVector) {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, translationVector);
    }

    /**
     * Rotates the shape by the given vector.
     * @method rotate
     * 
     * @param {vec3} rotationVector - The vector by which to rotate the shape.
     * @param {vec3} center - The center of rotation for the shape.
     * @param {float} rate - The rate at which to rotate the shape.
     * 
     * @returns {void}
     */
    rotate(rotationVector, center, rate) {
        // Set default values for center and rate
        if (!rate) rate = 1;
        if (!center) center = [0, 0, 0];
      
        // Translate the object to the origin using the negative center
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, [
          -center[0],
          -center[1],
          -center[2],
        ]);
      
        // Perform the rotation about the desired axes
        glMatrix.mat4.rotate(
          this.modelMatrix,
          this.modelMatrix,
          rate * rotationVector[0],
          [1, 0, 0]
        );
        glMatrix.mat4.rotate(
          this.modelMatrix,
          this.modelMatrix,
          rate * rotationVector[1],
          [0, 1, 0]
        );
        glMatrix.mat4.rotate(
          this.modelMatrix,
          this.modelMatrix,
          rate * rotationVector[2],
          [0, 0, 1]
        );
      
        // Translate the object back to its original position using center
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, center);
      }
      
    /**
     * scales the shape by the given vector.
     * @method scale
     * 
     * @param {vec3} scaleFactor - The vector by which to scale the shape.
     * @returns {void}
     */
    scale(scaleFactor) {
        glMatrix.mat4.scale(this.modelMatrix, this.modelMatrix, scaleFactor);
    }
    /******/

    

    /* ATTRIBUTE AND MATERIAL FUNCTIONS */
    setColor(color) { this.color = color;}
    setTexture(texture) { this.texture = texture; }
    setNormalMap(normalMap) { this.normalMap = normalMap; }

    /**
     * load attributes from a JSON file
     * @param {Array} ModelAttributeArray - array of JSON attribute properties
     * @param {number} index - index of the JSON object to load
     * @returns {void} 
     */
    loadAttributes(ModelAttributeArray, index) {
        this.vertices = ModelAttributeArray[index].vertices;
        this.normals = ModelAttributeArray[index].normals;
        this.textureCoords = ModelAttributeArray[index].textureCoords;
        this.indices = ModelAttributeArray[index].indices;
    }

    /**
     * load material properties from a JSON file
     * 
     * @param {Array} ModelMaterialsArray - array of JSON material properties
     * @param {number} index - index of the JSON object to load
     * @returns {void}
     */
    loadMaterial(ModelMaterialsArray, index) {
        this.ambientLight = ModelMaterialsArray[index].ambientm;
        this.diffuseLight = ModelMaterialsArray[index].diffusem;
        this.specularLight = ModelMaterialsArray[index].specularm;
        this.shininess = ModelMaterialsArray[index].shininess;
    }

    /** 
     * set the material properties for the shape manually
     * 
     * @param {Array} ambientLight - the ambient light of the shape
     * @param {Array} diffuseLight - the diffuse light of the shape
     * @param {Array} specularLight - the specular light of the shape
     * @param {number} shininess - the shininess of the shape
     * @returns {void}
     */
    setMaterialProperties(ambientLight, diffuseLight, specularLight, shininess) {
        if (!ambientLight) ambientLight = [0.2, 0.2, 0.2];
        if (!diffuseLight) diffuseLight = [0.8, 0.8, 0.8];
        if (!specularLight) specularLight = [0.5, 0.5, 0.5];
        if (!shininess) shininess = 72;

        this.ambientLight = ambientLight;
        this.diffuseLight = diffuseLight;
        this.specularLight = specularLight;
        this.shininess = shininess;

    }
    /******/

    /* PREPARE OBJECT FOR DRAWING */

    /**
     * Prepares the shape for drawing by setting up the index buffer and position/normal attributes.
     * @method setObjectAttributes
     * 
     * @returns {void}
     */
    setObjectAttributes() {
        // vars for vertex attributes
        const size = 3;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        // position attribute
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.positionBuffer = createBuffer(this.gl, new Float32Array(this.vertices), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(positionAttributeLocation);


        // normal attribute
        const normalAttributeLocation = this.gl.getAttribLocation(this.program, "a_normal");
        this.normalBuffer = createBuffer(this.gl, new Float32Array(this.normals), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        this.gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset);
        this.gl.enableVertexAttribArray(normalAttributeLocation);

        // index buffer
        this.indexBuffer = createBuffer(this.gl, new Uint16Array(this.indices), this.gl.ELEMENT_ARRAY_BUFFER);
    }

    /**
     * Sets up the uniforms for the shape.
     * @method setObjectUniforms
     * 
     * @returns {void}
     */
    setObjectUniforms() {
        // set up model matrix
        const modelMatrix = this.modelMatrix;
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "modelMatrix"), false, modelMatrix);

        // set up color uniform
        const u_color_location = this.gl.getUniformLocation(this.program, "u_color");
        this.gl.uniform3fv(u_color_location, this.color);

        // set up lighting
        const u_ambientMaterialLocation = this.gl.getUniformLocation(this.program, "u_ambientMaterial");
        const u_diffuseMaterialLocation = this.gl.getUniformLocation(this.program, "u_diffuseMaterial");
        const u_specularMaterialLocation = this.gl.getUniformLocation(this.program, "u_specularMaterial");
        const u_shininessLocation = this.gl.getUniformLocation(this.program, "u_shininess");
        
        this.gl.uniform3fv(u_ambientMaterialLocation, this.ambientLight);
        this.gl.uniform3fv(u_diffuseMaterialLocation, this.diffuseLight);
        this.gl.uniform3fv(u_specularMaterialLocation, this.specularLight);
        this.gl.uniform1f(u_shininessLocation, this.shininess);
    }

    /**
     * Sets up the texture for the shape.
     * @method setupTexture
     * 
     * @returns {void}
     */
    setupTexture() {
        // location of texture uniform
        const useTextureLocation = this.gl.getUniformLocation(this.program, "u_useTexture");

        // if no texture, set uniform to false and return
        if (this.texture == null) {
            this.gl.uniform1i(useTextureLocation, 0);
            return;
        }
        this.gl.uniform1i(useTextureLocation, 1);

        // set up texture
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        const textureLocation = this.gl.getUniformLocation(this.program, "u_texture");
        this.gl.uniform1i(textureLocation, 0);

        // set up texture coordinates
        const textureCoordAttributeLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
        this.textureCoordBuffer = createBuffer(this.gl, new Float32Array(this.textureCoords), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer); // Add this line
        this.gl.vertexAttribPointer(textureCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(textureCoordAttributeLocation);
    }

    /**
     * Sets up the normal map for the shape.
     * @method setupNormalMap
     * 
     * @returns {void}
     */
    setupNormalMap() {
        // location of normal map uniform

        // if no normal map, set uniform to false and return
        const useNormalMapLocation = this.gl.getUniformLocation(this.program, "u_useNormalMap");
        if (this.normalMap == null) {
            this.gl.uniform1i(useNormalMapLocation, 0);
            return;
        }
        this.gl.uniform1i(useNormalMapLocation, 1);

        // set up normal map
        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalMap);
        const normalMapLocation = this.gl.getUniformLocation(this.program, "u_normalMap");
        this.gl.uniform1i(normalMapLocation, 1);

        // set up normal map coordinates
        const normalCoordAttributeLocation = this.gl.getAttribLocation(this.program, "a_normalCoord");
        this.normalCoordBuffer = createBuffer(this.gl, new Float32Array(this.textureCoords), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalCoordBuffer); // Add this line
        this.gl.vertexAttribPointer(normalCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(normalCoordAttributeLocation);
    }
    /******/

    /* DRAW FUNCTION */
    
    /**
     * Draws the shape.
     * @method draw
     * 
     * @returns {void}
     */
    draw() {
        // set up vertex attributes
        this.setObjectAttributes();

        // set up uniforms
        this.setObjectUniforms();

        // set up texture
        this.setupTexture();

        // set up normal map
        this.setupNormalMap();

        // draw
        const primitiveType = this.gl.TRIANGLES;
        const count = this.indices.length;
        this.gl.drawElements(primitiveType, count, this.gl.UNSIGNED_SHORT, 0);
    }
}
