/* ESSENTIAL FUNCTIONS FOR WORKING WITH WEBGL */

// build and compile shader
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

// build and compile program
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

// build buffer
function createBuffer(gl, data, type) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buffer;
}

// load GLSL files into program
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
  
// initialize shaders
async function setup(gl) {
    const vertexShaderSource = await loadGLSLFile('./shaders/vertexShader.glsl');
    const fragmentShaderSource = await loadGLSLFile('./shaders/fragmentShader.glsl');

    const vertexShader = buildShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = buildShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = buildProgram(gl, vertexShader, fragmentShader);
    return program;   
}