function SobelFilter() {
    this.kernelSize = 3;
    this.xKernel = [[1, 0, -1], [2, 0, -2], [1, 0, -1]];
    this.yKernel = [[1, 2, 1], [0, 0, 0], [-1, -2, -1]];
    //this.xKernel = [[2, 1, 0, -1, -2], [3, 2, 0, -2, -3], [4, 3, 0, -3, -4], [3, 2, 0, -2, -3], [2, 1, 0, -1, -2]]
    //this.yKernel = [[2, 3, 4, 3, 2], [1, 2, 3, 2, 1], [0, 0, 0, 0, 0], [-2, -3, -4, -3, -2], [-1, -2, -3, -2, -1]]
}

SobelFilter.prototype.applyFilter = function(input, output) {
    var kby2 = Math.floor(this.kernelSize / 2);
    for (var i = 0; i < input.width; i++) {
        for (var j = 0; j < input.height; j++) {
            input.data[i][j].luminance = 0.3 * input.data[i][j][0] + 0.59 * input.data[i][j][1] + 0.11 * input.data[i][j][2];
            output.data[i][j].mag = 0;
            output.data[i][j].theta = 0;
            output.data[i][j].gx = 0;
            output.data[i][j].gy = 1;
        }
    }

    for (var i = kby2; i < (input.width - kby2); i++) {
        for (var j = kby2; j < (input.height - kby2); j++) {
            var sumX = 0.0; var sumY = 0.0;            
            for (var x = -kby2; x <= kby2; x++) {
                for (var y = -kby2; y <= kby2; y++) {
                    sumX += input.data[i + x][j + y].luminance * this.xKernel[x + kby2][y + kby2];
                    sumY += input.data[i + x][j + y].luminance * this.yKernel[x + kby2][y + kby2];
                }
            }
            var z = Math.sqrt(sumX * sumX + sumY * sumY);
            var theta = Math.atan(sumY / sumX);
            //Add r g b values for visualization.. Remove later.
            output.data[i][j][0] = 255 - z;
            output.data[i][j][1] = 255 - z;
            output.data[i][j][2] = 255 - z;
            output.data[i][j].gx = sumX;
            output.data[i][j].gy = sumY;
            output.data[i][j].mag = z;
            output.data[i][j].theta = theta;
        }
    }
}