function OutlineShader() {
    var OutlineShader_id = "outlineShader";
    this.id = Shader.createShader(OutlineShader_id);    
    this.uniforms = {}
    this.attributes = {}
    this.uniforms.outlineWidth = 0.01;
    this.uniforms.outlineColor = vec3.fromValues(0, 0, 0);
}

OutlineShader.prototype.locateAttributes = function() {
    gl.useProgram(this.id);
    this.attributes.vertices = gl.getAttribLocation(this.id, 'aVertexPosition');
    this.attributes.normals = gl.getAttribLocation(this.id, 'aVertexNormal');
    this.attributes.pvmMatrix = gl.getUniformLocation(this.id, "upvmMatrix");
    gl.useProgram(null);
}

OutlineShader.prototype.setUniforms = function() {
    gl.useProgram(this.id);

    gl.uniform1f(gl.getUniformLocation(this.id, "uOutlineWidth"), this.uniforms.outlineWidth);
    gl.uniform3fv(gl.getUniformLocation(this.id, "uOutlineColor"), this.uniforms.outlineColor);

    gl.useProgram(null);
}

OutlineShader.prototype.bind = function() {
    gl.useProgram(this.id);

    gl.enable(gl.CULL_FACE);
    gl.enableVertexAttribArray(this.attributes.vertices);
    gl.enableVertexAttribArray(this.attributes.normals);
}

OutlineShader.prototype.unbind = function() {
    gl.disable(gl.CULL_FACE);

    gl.disableVertexAttribArray(this.attributes.vertices);
    gl.disableVertexAttribArray(this.attributes.normals);

    gl.useProgram(null);
}
