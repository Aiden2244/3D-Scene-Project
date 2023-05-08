/* FUNCTIONS TO WORK WITH IMAGES AND TEXTURES */

/**
 * Loads an image from the specified URL and creates a texture from it.
 *
 * @async
 * @function loadImageAsTexture
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 * @param {string} url - The URL of the image to load.
 *
 * @returns {Promise<WebGLTexture>} A Promise that resolves with the created texture.
 */
async function loadImageAsTexture(gl, url) {
    const image = await loadImage(url);
  
    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Upload image data to texture
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
    // Set texture parameters for mipmaps
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    
    // Generate mipmaps
    gl.generateMipmap(gl.TEXTURE_2D);

    return texture;
}


/**
 * Loads an image object from the specified URL.
 *
 * @function loadImage
 *
 * @param {string} url - The URL of the image to load.
 *
 * @returns {Promise<JSImageObject>} A Promise that resolves with the loaded image object.
 */
function loadImage(url) {
    return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = url;
    });
}