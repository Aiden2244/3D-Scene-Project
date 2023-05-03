/* WORKS ON SHAPES TO ANIMATE THEM */


/* ANIMATION FUNCTIONs */

// rotations
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

// translations
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


// scales
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
/******/