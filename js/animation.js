/* WORKS ON SHAPES TO ANIMATE THEM */

/**
 * Animates a shape by rotating it around the X, Y, or Z-axes.
 *
 * @function animateXRotation
 * @function animateYRotation
 * @function animateZRotation
 *
 * @param {shape} shape - The shape to animate.
 * @param {number} [factor=1] - The factor by which to rotate the shape.
 */
function animateXRotation(shape, factor) {
    if (!factor) 
        factor = 1;
    shape.rotate([0.01 * factor, 0, 0]);
}

function animateYRotation(shape, factor) {
    if (!factor) 
        factor = 1;
    shape.rotate([0, 0.01 * factor, 0]);
}

function animateZRotation(shape, factor) {
    if (!factor) 
        factor = 1;
    shape.rotate([0, 0, 0.01 * factor]);
}


/**
 * Animates a shape by translating it along the X, Y, or Z-axes.
 *
 * @function animateXTranslation
 * @function animateYTranslation
 * @function animateZTranslation
 *
 * @param {shape} shape - The shape to animate.
 * @param {number} flag - The direction to translate the shape (-1 for left, 1 for right).
 * @param {number} [factor=1] - The factor by which to translate the shape.
 */
function animateXTranslation(shape, flag, factor) {
    if (!factor)
        factor = 1;
    shape.translate([0.01 * flag * factor, 0, 0]);
}

function animateYTranslation(shape, flag, factor) {
    if (!factor)
        factor = 1;
    shape.translate([0, 0.01 * flag * factor, 0]);
}

function animateZTranslation(shape, flag, factor) {
    if (!factor)
        factor = 1;
    shape.translate([0, 0, 0.01 * flag * factor]);
}



/**
 * Animates a shape by scaling it along the X, Y, or Z-axes.
 *
 * @function animateXScaling
 * @function animateYScaling
 * @function animateZScaling
 *
 * @param {shape} shape - The shape to animate.
 * @param {number} flag - The direction to scale the shape (-1 for shrink, 1 for grow).
 * @param {number} [factor=1] - The factor by which to scale the shape.
 */
function animateXScaling(shape, flag, factor) {
    if (!factor) 
        factor = 1;
    shape.scale([1 + (factor * 0.01 * flag), 1, 1]);
    
}

function animateYScaling(shape, flag, factor) {
    if (!factor) 
        factor = 1;
    shape.scale([1, 1 + (factor * 0.01 * flag), 1]);
    
}

function animateZScaling(shape, flag, factor) {
    if (!factor) 
        factor = 1;
    shape.scale([1, 1, 1 + (factor * 0.01 * flag)]);
    
}


function animateTransformation(shape, transformation, time, target) {
    
        if (time === target && transformation.type === 'translation') {
            const inverseVec = glMatrix.vec3.fromValues(-1.0, -1.0, -1.0);
            console.log("transformation:");
            console.log(transformation.value);
            glMatrix.vec3.multiply(transformation.value, transformation.value, inverseVec);
        }
        else if (time === target && transformation.type === 'scaling') {
            const offset = transformation.value[0] - 1;
            transformation.value[0] = 1 - offset;
            transformation.value[1] = 1 - offset;
            transformation.value[2] = 1 - offset;
        }


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

function animateObject(shape, time, target) {
    for (let i = 0; i < shape.transformations.length; i++) {
        console.log(shape.transformations.length)
        animateTransformation(shape, shape.transformations[i], time, target);
        //console.log(shape.transformations[i]);
    }
}
/******/

