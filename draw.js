//Main renderer manager
function Renderer() {
    this.defaultEye = vec3.fromValues(0.5, 0.5, -1.5);
    this.defaultCenter = vec3.fromValues(0.5, 0.5, 0);
    this.defaultUp = vec3.fromValues(0, 1, 0)
    this.keyPress = null;
    this.shiftModifier = false;
    this.eye = vec3.clone(this.defaultEye);
    this.center = vec3.clone(this.defaultCenter);
    this.up = vec3.clone(this.defaultUp);
    this.pMatrix = mat4.create();
    this.vMatrix = mat4.create();
    this.hMatrix = mat4.create();
    this.hpvMatrix = mat4.create();
    mat4.fromScaling(this.hMatrix, vec3.fromValues(-1, 1, 1));
    mat4.perspective(this.pMatrix, 0.5 * Math.PI, 1.0, 0.1, 10);
    this.models = {}
    this.models.cube = new Model("cube");
    this.models.sphere = new Model("sphere");
    this.model = this.models.cube;
}

Renderer.prototype.load = function() {
    this.simpleShader = new SimpleShader();
    this.simpleShader.uniforms.eye = renderer.eye;
    this.simpleShader.locateAttributes();
    this.simpleShader.setUniforms();
    this.celShader = new CelShader();
    this.celShader.uniforms.eye = renderer.eye;
    this.celShader.locateAttributes();
    this.celShader.setUniforms();
    this.outlineShader = new OutlineShader();
    this.outlineShader.locateAttributes();
    this.outlineShader.setUniforms();
    this.activeShaders = [this.simpleShader, this.celShader, this.outlineShader];
    this.activeShaderIndex = 0;
    this.pass1 = true;
    this.pass2 = true;
    this.shaderSelected = "shader-simple";
}

Renderer.prototype.update = function() {
    var e = document.getElementById("model");
    this.model = this.models[e.options[e.selectedIndex].value];
    e = document.getElementById("colors");
    this.celShader.uniforms.tones = e.options[e.selectedIndex].value;
    this.celShader.uniforms.specularTones = e.options[e.selectedIndex].value / 2;
    var dt = (new Date() - this.startTime);
    mat4.lookAt(this.vMatrix, this.eye, this.center, this.up);
    mat4.multiply(this.hpvMatrix, this.hMatrix, this.pMatrix);
    mat4.multiply(this.hpvMatrix, this.hpvMatrix, this.vMatrix);
    this.activeShaders[this.activeShaderIndex].uniforms.eye = this.eye;
    this.processKeys();
}

Renderer.prototype.render = function() {
    gl.clearColor(0.75, 0.75, 0.75, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if(this.shaderSelected == "shader-toon") {
        if(this.pass1)
            this.model.render(this.activeShaders[2], this.hpvMatrix);
        if(this.pass2)
            this.model.render(this.activeShaders[1], this.hpvMatrix);
    }
    else if(this.shaderSelected == "shader-simple") {
        this.model.render(this.activeShaders[0], this.hpvMatrix);
    }
}

Renderer.prototype.handleKeyUp = function(event) {
    if(event.key == "Shift") { renderer.shiftModifier = false; return; }
    renderer.keyPress = null;
}
Renderer.prototype.handleKeyDown = function(event) {
    if(event.key == "Shift") { renderer.shiftModifier = true; return; }
    switch(event.code) {
        case "Space" : 
            renderer.eye = vec3.clone(renderer.defaultEye);
            renderer.center = vec3.clone(renderer.defaultCenter);
            renderer.up = vec3.clone(renderer.defaultUp);
            return;
    }
    renderer.keyPress = event.code;
}

Renderer.prototype.processKeys = function() {
    if (!acceptInputs) return;
    var lookAt = vec3.create();
    var viewRight = vec3.create();
    var temp = vec3.create();

    lookAt = vec3.normalize(lookAt, vec3.subtract(temp, renderer.center, renderer.eye));
    viewRight = vec3.normalize(viewRight, vec3.cross(temp, lookAt, renderer.up));

    var viewDelta = 0.1;

    switch(renderer.keyPress) {
        case "KeyA" :
            if (!renderer.shiftModifier)
                renderer.eye = vec3.add(renderer.eye, renderer.eye, vec3.scale(temp, viewRight, viewDelta));
            renderer.center = vec3.add(renderer.center, renderer.center, vec3.scale(temp, viewRight, viewDelta));
            break;
        case "KeyD" :
            if (!renderer.shiftModifier)
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
    }
}

//Global variables
var gl;
var renderer;
var shaders = {};
var acceptInputs = false;

function draw() {
    Shader.loadFiles(['shaders/simple.vs', 'shaders/simple.fs', 'shaders/cel.vs', 'shaders/cel.fs', 'shaders/outline.vs', 'shaders/outline.fs'], function(shader) {
        shaders['simpleShader_vs'] = shader[0];
        shaders['simpleShader_fs'] = shader[1];
        shaders['celShader_vs'] = shader[2];
        shaders['celShader_fs'] = shader[3];
        shaders['outlineShader_vs'] = shader[4];
        shaders['outlineShader_fs'] = shader[5];
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