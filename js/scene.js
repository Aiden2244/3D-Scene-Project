class scene {
    constructor(gl, program) {
        this.canvas = document.getElementById('canvas');
        this.gl = gl;
        this.program = program;

        this.initializeCanvas();
        this.initializeCamera();

        this.projectionMatrix = glMatrix.mat4.create();
        glMatrix.mat4.perspective(this.projectionMatrix, 45 * Math.PI / 180, this.canvas.width / this.canvas.height, 0.1, 100.0);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "projectionMatrix"), false, this.projectionMatrix);

        this.clock = 0;
        this.flag = 1;

        this.objects = [];

        
    }

    initializeCanvas() {
        // clear color
        this.gl.clearColor(0.0, 0.4, 0.8, 1.0); // set the color to black
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas

        // cull faces
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);
    }

    initializeCamera() {
        this.camera = new camera(this.gl, this.program);

        this.camera.addEventListeners();
        console.log(this.camera.position);
    }


    animate() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); // clear the canvas
        
        
        /* INSERT SHAPE ANIMATIONS HERE */
        animateYRotation(this.objects[0], 1);
        animateYTranslation(this.objects[0], this.flag, 0.25);
        animateYScaling(this.objects[0], this.flag, 0.25);
        
        /******/
    
    
        /* DRAW EVERY SHAPE*/
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(this.gl, this.program);
        }
        /******/
    
        
        /* CYCLE THE CLOCK */
        const cycle_time = 240;

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