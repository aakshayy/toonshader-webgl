avconv -i input.avi -r 30 -f image2 %04d.png
avconv -f image2 -i %03d.png -r 30 output.avi