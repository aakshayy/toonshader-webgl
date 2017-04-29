function ImageClass(w, h) {
    this.width = w;
    this.height = h;
    this.data = new Array(w);
    for (var i = 0; i < w; i ++) {
        this.data[i] = new Array(h);
        for (var j = 0; j < h; j++) {
            this.data[i][j] = [0, 0, 0, 255];
        }
    }
}

ImageClass.diffImages = function(x, y) {
    var diff = new ImageClass(x.width, x.height);
    for (var w = 0; w < x.width; w++) {
        for (var h = 0; h < x.height; h++) {
            var rdiff = x.data[w][h][0] - y.data[w][h][0];
            var gdiff = x.data[w][h][1] - y.data[w][h][1];
            var bdiff = x.data[w][h][2] - y.data[w][h][2];
            var d = rdiff * rdiff + gdiff * gdiff + bdiff * bdiff;
            diff.data[w][h][0] = d;
            diff.data[w][h][1] = d;
            diff.data[w][h][2] = d;
        }
    }
    return diff;
}

ImageClass.multiplyImages = function(x, y) {
    var mul = new ImageClass(x.width, x.height);
    for (var w = 0; w < x.width; w++) {
        for (var h = 0; h < x.height; h++) {
            mul.data[w][h][0] = (x.data[w][h][0] * y.data[w][h][0]) / 255;
            mul.data[w][h][1] = (x.data[w][h][1] * y.data[w][h][1]) / 255;
            mul.data[w][h][2] = (x.data[w][h][2] * y.data[w][h][2]) / 255;
        }
    }
    return mul;
}