class scene {
    constructor(gl, program) {
        this.canvas = document.getElementById('canvas');
        this.gl = gl;
        this.program = program;

        this.projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "projectionMatrix"), false, this.projectionMatrix);
        
        this.clock = 0;
        this.flag = 1;
        
        this.objects = [];

        this.ambientLight = [0.2, 0.2, 0.2, 1.0];
        this.diffuseLight = [0.8, 0.8, 0.8, 1.0];
        this.specularLight = [0.5, 0.5, 0.5, 1.0];
        this.lightingDirection = [3, 10, 3]; // default lighting direction
        
        this.initializeCanvas();
        this.initializeCamera();
        this.initializeLighting();
        
    }

    /* INITIALIZE FUNCTIONS */
    initializeCanvas() {
        // clear color
        this.gl.clearColor(0.0, 0.4, 0.8, 1.0); // set the color to black
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas

        // cull faces
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);

        // enable depth test
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    initializeCamera() {
        this.camera = new camera(this.gl, this.program);
        this.camera.addEventListeners();
    }

    initializeLighting() {
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_ambientLight"), this.ambientLight);
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_diffuseLight"), this.diffuseLight);
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_specularLight"), this.specularLight);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, "u_lightingDirection"), this.lightingDirection);
    }
    /******/

    /* GLOBAL LIGHTING FUNCTIONS */
    setAmbientLight(ambientLight) {
        this.ambientLight = ambientLight;
        this.initializeLighting();
    }

    setDiffuseLight(diffuseLight) {
        this.diffuseLight = diffuseLight;
        this.initializeLighting();
    }

    setSpecularLight(specularLight) {
        this.specularLight = specularLight;
        this.initializeLighting();
    }
    /******/

    /* ANIMATION AND OBJECT FUNCTIONS */
    animate() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas
        
        
        const cycle_time = 1;
    
        /* DRAW EVERY SHAPE*/
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
            animateObject(this.objects[i], this.clock, cycle_time);
        }
        /******/
    
        
        /* CYCLE THE CLOCK */
        

        this.clock += (1 * this.flag)
        if (this.clock === cycle_time) {
            this.flag = -1;
        } else if (this.clock === 0) {
            this.flag = 1;
        }            
        /******/
    
        /* ANIMATE AGAIN */
        requestAnimationFrame(() => this.animate());
        /******/
    
    }

    addObject(object) {
        this.objects.push(object);
    }
}
/******/