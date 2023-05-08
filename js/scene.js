/**
 * @class scene
 * 
 * @classdesc A scene represents the world that the user sees. It contains all the information
 * needed to render the scene, including the objects in the scene, the lighting, and the camera.
 */
class scene {
    /**
     * The constructor for the scene class.
     * @constructor
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL2 context.
     * @param {WebGLProgram} program - The WebGL program.
     */
    constructor(gl, program) {
        // initialize the canvas, WebGL context, and program
        this.canvas = document.getElementById('canvas');
        this.gl = gl;
        this.program = program;

        // set the projection matrix
        this.projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "projectionMatrix"), false, this.projectionMatrix);
        
        // set the clock, flag, and cycle time for the animation loop
        this.clock = 0;
        this.flag = 1;
        this.cycleTime = 500;
        this.target = this.cycleTime / 2;
        
        // initialize the objects array
        this.objects = [];

        // initialize the lighting
        this.ambientLight = [0.4, 0.4, 0.4, 1.0];
        this.diffuseLight = [0.8, 0.8, 0.8, 1.0];
        this.specularLight = [0.5, 0.5, 0.5, 1.0];
        this.lightingDirection = [0, 1, 1]; 
        this.clearColor = [0.0, 0.4, 0.8, 1.0];
        
        // initialize the scene
        this.initializeCanvas();
        this.initializeCamera();
        this.initializeLighting();
        
    }
    /******/


    /* INITIALIZE FUNCTIONS */

    /**
     * Initializes the canvas and WebGL context. 
     * @method initializeCanvas
     * @returns {void}
     */
    initializeCanvas() {
        // clear color
        this.gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas

        // cull faces
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);

        // enable depth test
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LEQUAL);
    }

    /**
     * Initializes the camera and adds event listeners for movement.
     * @method initializeCamera
     * @returns {void}
     */
    initializeCamera() {
        this.camera = new camera(this.gl, this.program);
        this.camera.addEventListeners();
    }

    /**
     * Initializes the lighting by setting them to their default values.
     * @method initializeLighting
     * @returns {void}
     */
    initializeLighting() {
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_ambientLight"), this.ambientLight);
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_diffuseLight"), this.diffuseLight);
        this.gl.uniform4fv(this.gl.getUniformLocation(this.program, "u_specularLight"), this.specularLight);
        this.gl.uniform3fv(this.gl.getUniformLocation(this.program, "u_lightingDirection"), this.lightingDirection);
    }
    /******/

    
    /* ANIMATION AND OBJECT FUNCTIONS */

    /**
     * The animation loop for the scene.
     * @method animate
     * @returns {void}
     */
    animate() {
        // clear the canvas
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas
    
        // draw the objects
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw();
            animateObject(this.objects[i], this.clock, this.target);
        }
        
        // update the clock
        this.clock += (1 * this.flag)
        if (this.clock === this.cycleTime) {
            this.flag = -1;
        } else if (this.clock === 0) {
            this.flag = 1;
        }            
    
        // request the next frame
        requestAnimationFrame(() => this.animate());
    }

    /**
     * Adds an object to the scene.
     * @method addObject
     * 
     * @param {object} object - The object to be added to the scene.
     * @returns {void}
     */
    addObject(object) {
        this.objects.push(object);
    }
}
/******/