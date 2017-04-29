var context;

function putPixel(imagedata, x, y, color) {
    var pixelindex = (y * imagedata.width + x) * 4;
    imagedata.data[pixelindex] = color[0];
    imagedata.data[pixelindex + 1] = color[1];
    imagedata.data[pixelindex + 2] = color[2];
    imagedata.data[pixelindex + 3] = color[3];
}

function getPixel(imagedata, x, y) {
    var pixelindex = (y * imagedata.width + x) * 4;
    return [imagedata.data[pixelindex], imagedata.data[pixelindex + 1], imagedata.data[pixelindex + 2]];
}

function draw() {
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.getImageData(0, 0, w, h);
    var inputImage = new ImageClass(w, h);
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            var color = getPixel(imagedata, x, y);
            inputImage.data[x][y][0] = color[0];
            inputImage.data[x][y][1] = color[1];
            inputImage.data[x][y][2] = color[2];
        }
    }

    var sobelFilter = new SobelFilter();
    var outlineImage = new ImageClass(w, h);
    sobelFilter.applyFilter(inputImage, outlineImage);
    var outputImage = ImageClass.multiplyImages(inputImage, outlineImage);

    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            var c = [0, 0, 0, 255];
            putPixel(imagedata, x, y, outputImage.data[x][y]);
        }
    }
    context.putImageData(imagedata, 0, 0);
}

function main() {
    var canvas = document.getElementById("toonShadingCanvas");
    context = canvas.getContext("2d");
    var img = document.getElementById("sourceImage");
    img.src = "images/car.jpg"
    img.onload = function() {
        canvas.width = img.clientWidth;
        canvas.height = img.clientHeight;
        context.drawImage(img, 0, 0);
        draw();
    }
}