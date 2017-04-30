function MedianCut() {
    
}

function distance(c1, c2) {
    var dr = c1[0] - c2[0];
    var dg = c1[1] - c2[1];
    var db = c1[2] - c2[2];
    return dr * dr + dg * dg + db * db;
}

MedianCut.prototype.compare = function(a, b) {
    var i = this.index;
    if (a[i] < b[i]) {
        return -1;
    }
    else if (a[i] > b[i]) {
        return 1;
    }
    return 0;
}

MedianCut.prototype.maxIndex = function(bins) {
    var minR = 255, minG = 255, minB = 255;
    var maxR = 0, maxG = 0, maxB = 0;
    for (var i = 0; i < bins.length; i++) {
        if (bins[i][0] < minR) minR = bins[i][0];
        if (bins[i][1] < minG) minG = bins[i][1];
        if (bins[i][2] < minB) minB = bins[i][2];
        if (bins[i][0] > maxR) maxR = bins[i][0];
        if (bins[i][1] > maxG) maxG = bins[i][1];
        if (bins[i][2] > maxB) maxB = bins[i][2];
    }
    var diff = [maxR - minR, maxG - minG, maxB - minB];
    return diff.indexOf(Math.max(diff));
}

MedianCut.prototype.quantizeImage = function(image, outputImage) {
    var bins = [];
    for (var w = 0; w < image.width; w++) {
        for (var h = 0; h < image.height; h++) {
            bins.push([image.data[w][h][0], image.data[w][h][1], image.data[w][h][2]]);
        }
    }
    var colors = this.performCut(bins, 1);

    for (var w = 0; w < image.width; w++) {
        for (var h = 0; h < image.height; h++) {
            var color = [0, 0, 0];
            var minD = Infinity;
            for (var c = 0; c < colors.length; c++) {
                var d = distance(colors[c], image.data[w][h]);
                if(d < minD) {
                    minD = d;
                    color = colors[c];
                }
            }
            outputImage.data[w][h][0] = color[0];
            outputImage.data[w][h][1] = color[1];
            outputImage.data[w][h][2] = color[2];
        }
    }
}

MedianCut.prototype.performCut = function(bins, depth) {
    if (depth == 5) {
        return [bins[Math.floor(bins.length / 2)]];
    }
    this.index = this.maxIndex(bins);
    bins.sort(this.compare);
    var medianIndex = Math.floor(bins.length / 2);
    var bin1 = bins.slice(0, medianIndex);
    var bin2 = bins.slice(medianIndex + 1);
    
    var result1 = this.performCut(bin1, depth + 1);
    var result2 = this.performCut(bin2, depth + 1);
    var result = result1.concat(result2);
    return result;
}