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

