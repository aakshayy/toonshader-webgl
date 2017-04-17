function Mesh() {
    this.vertexPositionBuffer = null;
    this.vertexNormalBuffer = null;
    this.vertexIndexBuffer = null;
}

Mesh.cube = function() {
    var m = new Mesh();
    var size = 0.5;

    var vertices = new Float32Array(
	[  size, size, size,  -size, size, size,  -size,-size, size,   size,-size, size,    // v0-vsize-v2-v3 front
	   size, size, size,   size,-size, size,   size,-size,-size,   size, size,-size,    // v0-v3-v4-v5 right
	   size, size, size,   size, size,-size,  -size, size,-size,  -size, size, size,    // v0-v5-v6-vsize top
	  -size, size, size,  -size, size,-size,  -size,-size,-size,  -size,-size, size,    // vsize-v6-v7-v2 left
	  -size,-size,-size,   size,-size,-size,   size,-size, size,  -size,-size, size,    // v7-v4-v3-v2 bottom
	   size,-size,-size,  -size,-size,-size,  -size, size,-size,   size, size,-size ]   // v4-v7-v6-v5 back
	);

    var normals = new Float32Array(
	[  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,     // v0-v1-v2-v3 front
	   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,     // v0-v3-v4-v5 right
	   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,     // v0-v5-v6-v1 top
	  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,     // v1-v6-v7-v2 left
	   0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,     // v7-v4-v3-v2 bottom
	   0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]    // v4-v7-v6-v5 back
	);

    var indices = new Uint16Array(
	[  0, 1, 2,   0, 2, 3,    // front
	   4, 5, 6,   4, 6, 7,    // right
	   8, 9,10,   8,10,11,    // top
	  12,13,14,  12,14,15,    // left
	  16,17,18,  16,18,19,    // bottom
	  20,21,22,  20,22,23 ]   // back
	);

    m.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	m.vertexPositionBuffer.itemSize = 3;
	m.vertexPositionBuffer.numItems = vertices.length;

	m.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	m.vertexNormalBuffer.itemSize = 3;
	m.vertexNormalBuffer.numItems = normals.length;

    m.vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	m.vertexIndexBuffer.itemSize = 1;
	m.vertexIndexBuffer.numItems = indices.length;	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    return m;
}

Mesh.sphere = function()
{
    var radius = 0.5;
    var lats = 20;
    var longs = 20;
    var vertices = [];
    var normals = [];
    var indices = [];

    for (var latNumber = 0; latNumber <= lats; ++latNumber) {
        for (var longNumber = 0; longNumber <= longs; ++longNumber) {
            var theta = latNumber * Math.PI / lats;
            var phi = longNumber * 2 * Math.PI / longs;
            var sinTheta = Math.sin(theta);
            var sinPhi = Math.sin(phi);
            var cosTheta = Math.cos(theta);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            normals.push(x);
            normals.push(y);
            normals.push(z);
            vertices.push(radius * x);
            vertices.push(radius * y);
            vertices.push(radius * z);
        }
    }

    for (var latNumber = 0; latNumber < lats; ++latNumber) {
        for (var longNumber = 0; longNumber < longs; ++longNumber) {
            var first = (latNumber * (longs+1)) + longNumber;
            var second = first + longs + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first+1);

            indices.push(second);
            indices.push(second+1);
            indices.push(first+1);
        }
    }

	var m = new Mesh();

    m.vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	m.vertexNormalBuffer.itemSize = 3;
	m.vertexNormalBuffer.numItems = normals.length;

    m.vertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, m.vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
	m.vertexPositionBuffer.itemSize = 3;
	m.vertexPositionBuffer.numItems = vertices.length;

    m.vertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.vertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STREAM_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	m.vertexIndexBuffer.itemSize = 3;
	m.vertexIndexBuffer.numItems = indices.length;

    return m;
}


function Model() {
    //this.mesh = Mesh.cube();
    this.mesh = Mesh.sphere();
    this.xAxis = vec3.fromValues(1, 0, 0);
    this.yAxis = vec3.fromValues(0, 1, 0);
    this.translation = vec3.fromValues(0.5, 0.5, 0.5);
    this.center = vec3.fromValues(0, 0, 0);
    this.mMatrix = mat4.create();
    this.hpvmMatrix = mat4.create();
}

Model.prototype.makeModelTransform = function() {
    var zAxis = vec3.create();
    var sumRotation = mat4.create();
    var temp = mat4.create();
    var negCenter = vec3.create();
    
    vec3.normalize(zAxis, vec3.cross(zAxis, this.xAxis, this.yAxis));
    mat4.set(sumRotation,
        this.xAxis[0], this.yAxis[0], zAxis[0], 0,
        this.xAxis[1], this.yAxis[1], zAxis[1], 0,
        this.xAxis[2], this.yAxis[2], zAxis[2], 0,
        0, 0, 0, 1);
    vec3.negate(negCenter, this.center);
    mat4.multiply(sumRotation, sumRotation, mat4.fromTranslation(temp, negCenter));
    mat4.multiply(sumRotation, mat4.fromTranslation(temp, this.center), sumRotation);
    mat4.fromTranslation(this.mMatrix, this.translation);
    mat4.multiply(this.mMatrix, this.mMatrix, sumRotation);
}

Model.prototype.render = function() {
    var shader = renderer.simpleShader;
    this.makeModelTransform();
    mat4.multiply(this.hpvmMatrix, renderer.hpvMatrix, this.mMatrix)

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexPositionBuffer);
    gl.vertexAttribPointer(shader.attributes.vertices, this.mesh.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexNormalBuffer);
	gl.vertexAttribPointer(shader.attributes.normals, this.mesh.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.vertexIndexBuffer);

    shader.setUniforms();
    shader.bind();
    gl.uniformMatrix4fv(shader.attributes.mMatrix, false, this.mMatrix);
    gl.uniformMatrix4fv(shader.attributes.pvmMatrix, false, this.hpvmMatrix);

    gl.drawElements(gl.TRIANGLES, this.mesh.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

    shader.unbind();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function Shader() {}
//static shader functions

//extract and compile shader from document id
Shader.compileShader = function(id, shaderType) {
    var shader = gl.createShader(shaderType);
    var shaderSource = shaders[id];
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Failed to compile shader : " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

//create shader program with these vertex and fragment shaders.
Shader.createShader = function(id) {
    var program = gl.createProgram();
    gl.attachShader(program, Shader.compileShader(id + "_vs", gl.VERTEX_SHADER));
    gl.attachShader(program, Shader.compileShader(id + "_fs", gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log("Error linking shaders : " + gl.getProgramInfoLog(program));
    }
    else {
        console.log("Successfully loaded shader!");
    }
    return program;
}

//Thanks to David Roe for this function to load shader from files instead of embedding them in
//html files.
//http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts
Shader.loadFile = function(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}

Shader.loadFiles = function(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        Shader.loadFile(urls[i], i, partialCallback, errorCallback);
    }
}

//Shader instances
function SimpleShader() {
    var SimpleShader_id = "simpleShader";
    this.id = Shader.createShader(SimpleShader_id);    
    this.uniforms = {}
    this.attributes = {}
    this.uniforms.eye = renderer.eye;
    this.uniforms.lightPosition = vec3.fromValues(1.5, 1.5, -4.5);
    this.uniforms.lightAmbient = vec3.fromValues(1, 1, 1);
    this.uniforms.lightDiffuse = vec3.fromValues(1, 1, 1);
    this.uniforms.lightSpecular = vec3.fromValues(1, 1, 1);
    this.uniforms.ambient = vec3.fromValues(0.3, 0.3, 0.3);
    this.uniforms.diffuse = vec3.fromValues(0, 0.8, 0);
    this.uniforms.specular = vec3.fromValues(0.3, 0.3, 0.3);
    this.uniforms.shininess = 16.0;
}

SimpleShader.prototype.locateAttributes = function() {
    gl.useProgram(this.id);
    this.attributes.vertices = gl.getAttribLocation(this.id, 'aVertexPosition');
    this.attributes.normals = gl.getAttribLocation(this.id, 'aVertexNormal');
    this.attributes.mMatrix = gl.getUniformLocation(this.id, "umMatrix");
    this.attributes.pvmMatrix = gl.getUniformLocation(this.id, "upvmMatrix");
    gl.useProgram(null);
}

SimpleShader.prototype.setUniforms = function() {
    gl.useProgram(this.id);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uEyePosition"), this.uniforms.eye);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightAmbient"), this.uniforms.lightAmbient);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightDiffuse"), this.uniforms.lightDiffuse);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightSpecular"), this.uniforms.lightSpecular);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uLightPosition"), this.uniforms.lightPosition);
    
    gl.uniform3fv(gl.getUniformLocation(this.id, "uAmbient"), this.uniforms.ambient);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uDiffuse"), this.uniforms.diffuse);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uSpecular"), this.uniforms.specular);
    gl.uniform1f(gl.getUniformLocation(this.id, "uShininess"), this.uniforms.shininess);

    gl.useProgram(null);
}

SimpleShader.prototype.bind = function() {
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.id);

    gl.enableVertexAttribArray(this.attributes.vertices);
    gl.enableVertexAttribArray(this.attributes.normals);
}

SimpleShader.prototype.unbind = function() {
    gl.disable(gl.DEPTH_TEST);

    gl.disableVertexAttribArray(this.attributes.vertices);
    gl.disableVertexAttribArray(this.attributes.normals);

    gl.useProgram(null);
}

//Main renderer manager
function Renderer() {
    this.eye = vec3.clone(defaultEye);
    this.center = vec3.clone(defaultCenter);
    this.up = vec3.clone(defaultUp);
    this.pMatrix = mat4.create();
    this.vMatrix = mat4.create();
    this.hMatrix = mat4.create();
    this.hpvMatrix = mat4.create();
    mat4.fromScaling(this.hMatrix, vec3.fromValues(-1, 1, 1));
    mat4.perspective(this.pMatrix, 0.5 * Math.PI, 1.0, 0.1, 10);
    this.model = new Model();
}

Renderer.prototype.load = function() {
    this.simpleShader = new SimpleShader();
    this.simpleShader.locateAttributes();
    this.simpleShader.setUniforms();
}

Renderer.prototype.update = function() {
    var dt = (new Date() - this.startTime);
    mat4.lookAt(this.vMatrix, this.eye, this.center, this.up);
    mat4.multiply(this.hpvMatrix, this.hMatrix, this.pMatrix);
    mat4.multiply(this.hpvMatrix, this.hpvMatrix, this.vMatrix);
    this.simpleShader.uniforms.eye = this.eye;
    this.processKeys();
}

Renderer.prototype.render = function() {
    gl.clearColor(0.75, 0.75, 0.75, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
    this.model.render();   
}

Renderer.prototype.handleKeyUp = function(event) {
    if(event.key == "Shift") { shiftModifier = false; return; }
    keyPress = null
}
Renderer.prototype.handleKeyDown = function(event) {
    if(event.key == "Shift") { shiftModifier = true; return; }
    keyPress = event.code
}

Renderer.prototype.processKeys = function() {
    var lookAt = vec3.create();
    var viewRight = vec3.create();
    var temp = vec3.create();

    lookAt = vec3.normalize(lookAt, vec3.subtract(temp, renderer.center, renderer.eye));
    viewRight = vec3.normalize(viewRight, vec3.cross(temp, lookAt, renderer.up));

    var viewDelta = 0.1;

    switch(keyPress) {
        case "KeyA" :
            if (!shiftModifier)
                renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, viewRight, viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, viewRight, viewDelta));
            break;
        case "KeyD" :
            if (!shiftModifier)
                renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, viewRight, -viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, viewRight, -viewDelta));
            break;
        case "KeyS" :
            renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, lookAt, -viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, lookAt, -viewDelta));
            break;
        case "KeyW" :
            renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, lookAt, viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, lookAt, viewDelta));
            break;
        /*
        case "KeyQ" :
            renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, renderer.up, -viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, renderer.up, -viewDelta));
            break;
        case "KeyE" :
            renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, renderer.up, viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, renderer.up, viewDelta));
            break;
        */
        case "Space" : 
            renderer.eye = vec3.clone(defaultEye);
            renderer.center = vec3.clone(defaultCenter);
            renderer.up = vec3.clone(defaultUp);
    }
}

//Global variables
var gl;
var renderer;
var shaders = {};
var acceptInputs = false;
var keyPress = null;
var shiftModifier = false;
var defaultEye = vec3.fromValues(0.5, 0.5, -1.5);
var defaultCenter = vec3.fromValues(0.5, 0.5, 0);
var defaultUp = vec3.fromValues(0, 1, 0)

function draw() {
    Shader.loadFiles(['shaders/simple.vs', 'shaders/simple.fs'], function(shader) {
        shaders['simpleShader_vs'] = shader[0];
        shaders['simpleShader_fs'] = shader[1];
        renderer = new Renderer();
        renderer.load();
        renderer.startTime = new Date();
        document.onkeydown = renderer.handleKeyDown;
        document.onkeyup = renderer.handleKeyUp;
        acceptInputs = true;
        tick();
    })
}

function tick() {
    renderer.update();
    renderer.render();
    window.requestAnimationFrame(tick);
}

//Main function
function main() {
    canvas = document.getElementById("toonShadingCanvas");
    gl = canvas.getContext("experimental-webgl");
    draw();
}