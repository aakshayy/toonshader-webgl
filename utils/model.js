function Model(name) {
    if(name == "cube")
        this.mesh = Mesh.cube();
    else if(name == "sphere")
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

Model.prototype.render = function(shader, hpvMatrix) {
    this.makeModelTransform();
    mat4.multiply(this.hpvmMatrix, hpvMatrix, this.mMatrix)

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
