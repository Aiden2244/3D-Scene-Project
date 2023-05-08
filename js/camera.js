/**
 * @class camera
 * 
 * @classdesc A camera represents the user's point of view. It allows the user to move around,
 * and sets the view matrix for the scene.
 */
class camera {
    /**
     * The constructor for the camera class.
     * @constructor
     * 
     * @param {WebGL2RenderingContext} gl - The WebGL2 context.
     * @param {WebGLProgram} program - The WebGL program.
     */
    constructor(gl, program) {
        // initialize the WebGL context and program
        this.gl = gl;
        this.program = program;

        // set the initial position, lookAtPoint, and up vector for the camera
        this.position = [-12, 0, 21]
        this.lookAtPoint = [0, 0, 0];
        this.upVector = [0, 1, 0];

        // set the view matrix
        this.viewMatrix = glMatrix.mat4.create();
        this.updateCamera();
    }

    /**
     * Updates the view matrix for the camera.
     * @method updateCamera
     * @returns {void}
     */
    updateCamera() {
        glMatrix.mat4.lookAt(this.viewMatrix, this.position, this.lookAtPoint, [0, 1, 0]);
        this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, "viewMatrix"), false, this.viewMatrix);
    }

    /**
     * Calculates the look direction vector for the camera.
     * @method calculateLookDirection
     * 
     * @returns {vec3} The look direction vector.
     */
    calculateLookDirection() {
        const lookDirection = glMatrix.vec3.create();
        glMatrix.vec3.subtract(lookDirection, this.lookAtPoint, this.position);
        return lookDirection;
    }

    /**
     * Rotates the camera about its up vector.
     * @method rotate
     * 
     * @param {number} direction - The direction to rotate the camera. 1 is clockwise, -1 is counterclockwise.
     * 
     * @returns {void}
     */
    rotate(direction) {
        // set the increment for the rotation
        const angleIncrement = 0.05 * direction;

        // Calculate the rotation matrix around the camera's up vector
        const rotationMatrix = glMatrix.mat4.create();
        glMatrix.mat4.rotate(rotationMatrix, rotationMatrix, angleIncrement, this.upVector);

        // Compute the look direction vector
        const lookDirection = this.calculateLookDirection();

        // Apply the rotation matrix to the look direction
        const rotatedLookDirection = glMatrix.vec3.create();
        glMatrix.vec3.transformMat4(rotatedLookDirection, lookDirection, rotationMatrix);
        glMatrix.vec3.add(this.lookAtPoint, this.position, rotatedLookDirection);

        // Update the view matrix with the new position and lookAtPoint
        this.updateCamera();
    }


    /**
     * Strafes the camera left or right.
     * @method strafe
     * 
     * @param {number} direction - The direction to strafe the camera. 1 is left, -1 is right.
     * 
     * @returns {void}
     */
    strafe(direction) {
        // set the increment for the strafe
        const strafeIncrement = 0.01 * direction;

        // Compute the look direction vector
        const lookDirection = this.calculateLookDirection();

        // create the vector to store the translation
        const strafeVector = glMatrix.vec3.create();
        
        // calculate the strafe vector
        glMatrix.vec3.cross(strafeVector, this.upVector, lookDirection); // calculate the strafe vector
        glMatrix.vec3.scaleAndAdd(this.position, this.position, strafeVector, strafeIncrement);
        glMatrix.vec3.scaleAndAdd(this.lookAtPoint, this.lookAtPoint, strafeVector, strafeIncrement);

        // Update the view matrix with the new position and lookAtPoint
        this.updateCamera();
    }

    /**
     * Pushes the camera forward or backward.
     * @method pushIn
     * 
     * @param {number} direction - The direction to push the camera. 1 is forward, -1 is backward.
     * 
     * @returns {void}
     */
    pushIn(direction) {
        // shift the camera's position forward or backward
        const pushIncrement = 0.01 * direction;

        // Compute the look direction vector
        const lookDirection = this.calculateLookDirection();

        // shift the camera's position and lookAtPoint forward or backward
        glMatrix.vec3.scaleAndAdd(this.position, this.position, lookDirection, pushIncrement);
        glMatrix.vec3.scaleAndAdd(this.lookAtPoint, this.lookAtPoint, lookDirection, pushIncrement);

        // Update the view matrix with the new position and lookAtPoint
        this.updateCamera();
    }

    /**
     * Pedestals the camera up or down.
     * @method pedestal
     * 
     * @param {number} direction - The direction to pedestal the camera. 1 is up, -1 is down.
     * 
     * @returns {void}
     */
    pedestal(direction) {
        // set the increment for the pedestal
        const pedestalIncrement = 0.25 * direction;

        // shift the camera's position and lookAtPoint up or down
        glMatrix.vec3.scaleAndAdd(this.position, this.position, this.upVector, pedestalIncrement);
        glMatrix.vec3.scaleAndAdd(this.lookAtPoint, this.lookAtPoint, this.upVector, pedestalIncrement);

        // Update the view matrix with the new position and lookAtPoint
        this.updateCamera();

        // prevent the camera from going below the ground plane
        if (this.position[1] <= 0) {
            this.position[1] = 0;
            this.lookAtPoint[1] = 0;
        }
    }

    /**
     * Resets the camera to its initial position.
     * @method reset
     * 
     * @returns {void}
     */
    reset() {
        this.position = [-12, 0, 21];
        this.lookAtPoint = [0, 0, 0];
        this.updateCamera();
    }

    /**
     * Adds event listeners for the camera so that it can be controlled by the user.
     * @method addEventListeners
     * 
     * @returns {void}
     */
    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            
            // rotations
            // when 'j' is pressed. rotate camera left
            if (event.key === 'j') {
                this.rotate(1);
            }
            // when 'l' is pressed. rotate camera right
            else if (event.key === 'l') {
                this.rotate(-1);
            }

            // strafing
            // when 'a' is pressed. strafe camera left
            else if (event.key === 'a') {
                this.strafe(1);
            }
            // when 'd' is pressed. strafe camera right
            else if (event.key === 'd') {
                this.strafe(-1);
            }

            // pushing
            // when 'w' is pressed. push camera in
            else if (event.key === 'w') {
                this.pushIn(1);
            }
            // when 's' is pressed. push camera out
            else if (event.key === 's') {
                this.pushIn(-1);
            }

            // up and down movement
            // when 'i' is pressed. move camera up
            else if (event.key === 'i') {
                this.pedestal(1);
            }
            // when 'k' is pressed. move camera down
            else if (event.key === 'k') {
                this.pedestal(-1);
            }

            // reset
            // when space is pressed. reset camera
            else if (event.key === ' ') {
                this.reset();
            }

        });

    }

}