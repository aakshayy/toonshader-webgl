function Renderer(context1, context2) {
    this.context1 = context1;
    this.context2 = context2;
    this.imageLoaded = false;
    this.medianCut = new MedianCut();
    this.medianCut.logNumberOfColors = 5;
    this.sobelFilter = new SobelFilter();
}

Renderer.prototype.putPixel = function(x, y, color) {
    var pixelindex = (y * this.imagedata.width + x) * 4;
    this.imagedata.data[pixelindex] = color[0];
    this.imagedata.data[pixelindex + 1] = color[1];
    this.imagedata.data[pixelindex + 2] = color[2];
    this.imagedata.data[pixelindex + 3] = color[3];
}

Renderer.prototype.getPixel = function(x, y) {
    var pixelindex = (y * this.imagedata.width + x) * 4;
    return [this.imagedata.data[pixelindex], this.imagedata.data[pixelindex + 1], this.imagedata.data[pixelindex + 2]];
}

Renderer.prototype.render = function(context, image) {
    var w = image.width;
    var h = image.height;    
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            this.putPixel(x, y, image.data[x][y]);
        }
    }
    context.putImageData(this.imagedata, 0, 0);
}

Renderer.prototype.update = function() {
    this.medianCut.quantizeImage(this.inputImage, this.quantizedImage);
    this.sobelFilter.applyFilter(this.inputImage, this.outlineImage);
    this.outputImage = ImageClass.multiplyImages(this.quantizedImage, this.outlineImage);
}

Renderer.prototype.draw = function() {
    var w = this.context1.canvas.width;
    var h = this.context1.canvas.height;
    this.imagedata = this.context2.getImageData(0, 0, w, h);
    this.inputImage = new ImageClass(w, h);
    
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            var color = this.getPixel(x, y);
            this.inputImage.data[x][y][0] = color[0];
            this.inputImage.data[x][y][1] = color[1];
            this.inputImage.data[x][y][2] = color[2];
        }
    }
    this.quantizedImage = new ImageClass(w, h);
    this.outlineImage = new ImageClass(w, h);

    this.update();
    this.render(this.context1, this.outputImage);
}

var renderer;

function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}


function download(canvasId, filename) {
    var link = document.createElement("a");
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
    console.log("Downloading")
}

function main() {
    var canvas1 = document.getElementById("canvas1");
    var context1 = canvas1.getContext("2d");
    var canvas2 = document.getElementById("canvas2");
    var context2 = canvas2.getContext("2d");
    var img = document.createElement("img");
    renderer = new Renderer(context1, context2);

    var frameSize = 100;
    var z = 0;
    var loadImageListener = function() {
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        canvas1.width = canvas2.width = this.naturalWidth;
        canvas1.height = canvas2.height = this.naturalHeight;
        context2.drawImage(this, 0, 0);
        renderer.draw();
        renderer.imageLoaded = true;
        download("canvas1", "output" + z);
        z = z + 1;
    }
    
    img.addEventListener("load", loadImageListener, false);

    for(var i = 1; i < frameSize; i++) {
        var filename = padDigits(i, 4);
        img.src = "video/" + filename + ".png";
        getNextFrame = false;
        console.log("Loaded " + filename)
    }
    console.log("Done")
}