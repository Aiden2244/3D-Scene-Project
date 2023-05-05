/* ESSENTIAL FUNCTIONS FOR WORKING WITH WEBGL */

/**
 * Builds and compiles a shader from the specified source code.
 *
 * @function buildShader
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 * @param {string} source - The source code of the shader to build and compile.
 * @param {number} type - The type of shader to build and compile (e.g. gl.VERTEX_SHADER or gl.FRAGMENT_SHADER).
 *
 * @returns {WebGLShader} The compiled shader.
 */
function buildShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}


/**
 * Builds and compiles a rendering program from the specified vertex and fragment shaders.
 *
 * @function buildProgram
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 * @param {WebGLShader} vertexShader - The compiled vertex shader to use.
 * @param {WebGLShader} fragmentShader - The compiled fragment shader to use.
 *
 * @returns {WebGLProgram} The compiled rendering program.
 */
function buildProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}


/**
 * Creates a buffer from the specified data.
 *
 * @function createBuffer
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 * @param {TypedArray} data - The data to use for the buffer.
 * @param {number} type - The type of buffer to create (e.g. gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER).
 *
 * @returns {WebGLBuffer} The created buffer.
 */
function createBuffer(gl, data, type) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
}


/**
 * Loads a GLSL file from the specified URL and returns its contents as a string.
 *
 * @async
 * @function loadGLSLFile
 *
 * @param {string} url - The URL of the GLSL file to load.
 *
 * @returns {Promise<string>} A Promise that resolves with the contents of the GLSL file as a string.
 */
async function loadGLSLFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }
      const glslString = await response.text();
      return glslString;
    } catch (error) {
      console.error(`Error loading GLSL file: ${error}`);
      return null;
    }
}
  

/**
 * Sets up the WebGL2 context, builds and compiles a rendering program from the vertex and fragment shaders,
 * and returns the compiled program.
 *
 * @async
 * @function setup
 *
 * @param {WebGL2RenderingContext} gl - The WebGL2 context.
 *
 * @returns {Promise<WebGLProgram>} A Promise that resolves with the compiled rendering program.
 */
async function setup(gl) {
    const vertexShaderSource = await loadGLSLFile('./shaders/vertexShader.glsl');
    const fragmentShaderSource = await loadGLSLFile('./shaders/fragmentShader.glsl');

    const vertexShader = buildShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = buildShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = buildProgram(gl, vertexShader, fragmentShader);
    return program;   
}