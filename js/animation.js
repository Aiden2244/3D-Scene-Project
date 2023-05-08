/**
* Animates a shape using a single transformation
*
* @function animateTransformation
*
* @param {Shape} shape - The shape to animate.
* @param {object} transformation - The transformation to apply to the shape.
* @param {number} time - The current time of the animation.
* @param {number} target - The target time of the animation to reverse (for oscillating animations).
*
8 @returns {void}
*/
function animateTransformation(shape, transformation, time, target) {
    // if the time equals the target time, reverse the translation
    if (time === target && transformation.type === 'translation') {
        const inverseVec = glMatrix.vec3.fromValues(-1.0, -1.0, -1.0);
        glMatrix.vec3.multiply(transformation.value, transformation.value, inverseVec);
    }
    // if the time equals the target time, reverse the scaling
    else if (time === target && transformation.type === 'scaling') {
        const offset = transformation.value[0] - 1;
        transformation.value[0] = 1 - offset;
        transformation.value[1] = 1 - offset;
        transformation.value[2] = 1 - offset;
    }

    // apply the transformation to the shape
    if (transformation.type === 'translation') {
        shape.translate(transformation.value);
    } else if (transformation.type === 'rotation') {
        shape.rotate(transformation.value, transformation.center, transformation.rate);
    } else if (transformation.type === 'scaling') {
        shape.scale(transformation.value);
    } else if (Array.isArray(transformation) && transformation.length === 16) {
        glMatrix.mat4.multiply(shape.modelMatrix, shape.modelMatrix, transformation);

    }
}


/**
 * Loops through all transformations of a shape and animates them.
 * 
 * @function animateObject
 * 
 * @param {Shape} shape - The shape to animate.
 * @param {number} time - The current time of the animation.
 * @param {number} target - The target time of the animation to reverse (for oscillating animations).
 * 
 * @returns {void}
 */
function animateObject(shape, time, target) {
    for (let i = 0; i < shape.transformations.length; i++) {
        animateTransformation(shape, shape.transformations[i], time, target);
    }
}
/******/

