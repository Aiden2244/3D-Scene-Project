/* SHAPE CLASS */
class shape {
    constructor(gl, program) {
        this.gl = gl; // gl context
        this.program = program; // WebGL program

        this.color = [1, 1, 1]; // default color of the shape
        this.diffuseLight = [0.8, 0.8, 0.8]; // default diffuse light
        this.ambientLight = [0.2, 0.2, 0.2]; // default ambient light
        this.specularLight = [0.5, 0.5, 0.5]; // default specular light
        this.shininess = 72; // default shininess

        this.modelMatrix = glMatrix.mat4.create(); // each shape has its own model matrix

        this.texture = null; // texture of the shape
        this.normalMap = null; // normal map of the shape

        this.transformations = []; // array to store the transformations of the shape

        this.vertices = [];
        this.normals = [];
        this.textureCoords = [];
        this.indices = [];


        this.positionBuffer;
        this.normalBuffer;
        this.textureCoordBuffer;
        this.indexBuffer;
    }

    /* MODEL MATRIX FUNCTIONS */
    translate(translationVector) {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, translationVector);
    }

    rotate(rotationVector, rate) {
        if (!rate) rate = 1;
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rate * rotationVector[0], [1, 0, 0]);
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rate * rotationVector[1], [0, 1, 0]);
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rate * rotationVector[2], [0, 0, 1]);
    }
    
    scale(scaleFactor) {
        glMatrix.mat4.scale(this.modelMatrix, this.modelMatrix, scaleFactor);
    }
    /******/

    

    /* COLOR FUNCTION */
    setColor(color) {
        this.color = color;
    }
    /******/

    /* TEXTURE FUNCTION */
    setTexture(texture) {
        this.texture = texture;
    }

    /* NORMAL MAP FUNCTION */
    setNormalMap(normalMap) {
        this.normalMap = normalMap;
    }

    /* OBJECT ATTRIBUTE FUNCTIONS */
    loadAttributes(ModelAttributeArray, index) {
        this.vertices = ModelAttributeArray[index].vertices;
        this.normals = ModelAttributeArray[index].normals;
        this.textureCoords = ModelAttributeArray[index].textureCoords;
        this.indices = ModelAttributeArray[index].indices;
    }

    /* OBJECT MATERIAL FUNCTIONS */
    loadMaterial(ModelMaterialsArray, index) {
        this.ambientLight = ModelMaterialsArray[index].ambientm;
        this.diffuseLight = ModelMaterialsArray[index].diffusem;
        this.specularLight = ModelMaterialsArray[index].specularm;
        this.shininess = ModelMaterialsArray[index].shininess;
    }

    /* PREPARE OBJECT FOR DRAWING */
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

    setupTexture() {
        // set up texture
        const useTextureLocation = this.gl.getUniformLocation(this.program, "u_useTexture");
        if (this.texture == null) {
            this.gl.uniform1i(useTextureLocation, 0);
            return;
        }
        this.gl.uniform1i(useTextureLocation, 1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        const textureLocation = this.gl.getUniformLocation(this.program, "u_texture");
        this.gl.uniform1i(textureLocation, 0);

        const textureCoordAttributeLocation = this.gl.getAttribLocation(this.program, "a_texCoord");
        this.textureCoordBuffer = createBuffer(this.gl, new Float32Array(this.textureCoords), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer); // Add this line
        this.gl.vertexAttribPointer(textureCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(textureCoordAttributeLocation);
    }

    setupNormalMap() {
        const useNormalMapLocation = this.gl.getUniformLocation(this.program, "u_useNormalMap");
        if (this.normalMap == null) {
            this.gl.uniform1i(useNormalMapLocation, 0);
            return;
        }
        this.gl.uniform1i(useNormalMapLocation, 1);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalMap);
        const normalMapLocation = this.gl.getUniformLocation(this.program, "u_normalMap");
        this.gl.uniform1i(normalMapLocation, 1);

        const normalCoordAttributeLocation = this.gl.getAttribLocation(this.program, "a_normalCoord");
        this.normalCoordBuffer = createBuffer(this.gl, new Float32Array(this.textureCoords), this.gl.ARRAY_BUFFER);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalCoordBuffer); // Add this line
        this.gl.vertexAttribPointer(normalCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(normalCoordAttributeLocation);
    }

    /* DRAW FUNCTION */
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
