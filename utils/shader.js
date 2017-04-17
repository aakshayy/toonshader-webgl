function Shader() {}
//static shader functions

//extract and compile shader
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