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
