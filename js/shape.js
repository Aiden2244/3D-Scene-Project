/* SHAPE CLASS */
class shape {
    constructor(gl, program, name) {
        this.gl = gl; // gl context
        this.program = program; // WebGL program
        this.name = name;

        this.color = [Math.random(), Math.random(), Math.random()]; // default color of the shape
        this.lightingDirection = [0, 3, 0]; // default lighting direction
        this.diffuseLight = []; // default lighting color
        this.ambientLight = []; // default ambient light
        this.specularLight = []; // default specular light
        this.shininess = 0; // default shininess
        this.shading = 0; // default shading

        this.modelMatrix = glMatrix.mat4.create(); // each shape has its own model matrix

        this.texture = null; // texture of the shape

        this.vertices = [];
        this.indices = [];
        this.textureCoords = [];

        this.positionBuffer;
        this.indexBuffer;
        this.textureCoordBuffer;
    }

    /* MODEL MATRIX FUNCTIONS */
    translate(translationVector) {
        glMatrix.mat4.translate(this.modelMatrix, this.modelMatrix, translationVector);
    }

    rotate(rotationVector) {
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rotationVector[0], [1, 0, 0]);
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rotationVector[1], [0, 1, 0]);
        glMatrix.mat4.rotate(this.modelMatrix, this.modelMatrix, rotationVector[2], [0, 0, 1]);
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

    /* OBJECT ATTRIBUTE FUNCTIONS */
    loadAttributes(ModelAttributeArray, index) {
        this.vertices = ModelAttributeArray[index].vertices;
        this.normals = ModelAttributeArray[index].normals;
        this.textureCoords = ModelAttributeArray[index].textureCoords;
        this.indices = ModelAttributeArray[index].indices;

        this.indexBuffer = createBuffer(this.gl, new Uint16Array(this.indices), this.gl.ELEMENT_ARRAY_BUFFER);
        this.textureCoordBuffer = createBuffer(this.gl, new Float32Array(this.textureCoords), this.gl.ARRAY_BUFFER);
        

    }

    /* OBJECT MATERIAL FUNCTIONS */
    loadMaterial(ModelMaterialsArray, index) {
        this.ambientLight = ModelMaterialsArray[index].ambientm;
        this.diffuseLight = ModelMaterialsArray[index].diffusem;
        this.specularLight = ModelMaterialsArray[index].specularm;
        this.shininess = ModelMaterialsArray[index].shininess;
        this.shading = ModelMaterialsArray[index].shadingm;
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
        // const normalAttributeLocation = this.gl.getAttribLocation(this.program, "a_normal");
        // this.normalBuffer = createBuffer(this.gl, new Float32Array(this.normals), this.gl.ARRAY_BUFFER);
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        // this.gl.vertexAttribPointer(normalAttributeLocation, size, type, normalize, stride, offset);
        // this.gl.enableVertexAttribArray(normalAttributeLocation);


    }

    setObjectUniforms() {
        // set up model matrix
        const modelMatrix = this.modelMatrix;
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "modelMatrix"), false, modelMatrix);

        // set up color uniform
        const u_color_location = this.gl.getUniformLocation(this.program, "u_color");
        this.gl.uniform3fv(u_color_location, this.color);

        // set up lighting
        const u_lightColorLocation = this.gl.getUniformLocation(this.program, "u_lightColor");
        const u_ambientLightLocation = this.gl.getUniformLocation(this.program, "u_ambientLight");
        const u_lightDirectionLocation = this.gl.getUniformLocation(this.program, "u_lightDirection");
        
        this.gl.uniform3fv(u_lightColorLocation, this.diffuseLight);
        this.gl.uniform3fv(u_lightDirectionLocation, this.lightingDirection);
        this.gl.uniform3fv(u_ambientLightLocation, this.ambientLight);
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
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer); // Add this line
        this.gl.vertexAttribPointer(textureCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(textureCoordAttributeLocation);
    }

    /* DRAW FUNCTION */
    draw() {

        // set up vertex attributes
        this.setObjectAttributes();

        // set up uniforms
        this.setObjectUniforms();

        // set up texture
        this.setupTexture();

        // draw
        const primitiveType = this.gl.TRIANGLES;
        const count = this.indices.length;
        this.gl.drawElements(primitiveType, count, this.gl.UNSIGNED_SHORT, 0);
    }
}