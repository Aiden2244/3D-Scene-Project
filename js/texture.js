/* FUNCTIONS TO WORK WITH IMAGES AND TEXTURES */

// generate a texture from an image
async function loadImageAsTexture(gl, url) {
    const image = await loadImage(url);
  
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    
    // Upload image data to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // Set texture parameters for mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Generate mipmaps
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
}


// load a JS image object from a URL
function loadImage(url) {
    return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
    });
}