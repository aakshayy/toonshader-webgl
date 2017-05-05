# CSC 562 Project Part 2: Toon Shading 

Author: Akshay Arlikatti

Unity Id: aarlika
### Description
---
* This project aims to implement the non-photorealistic 'cartoon-like' rendering.
* Typically, toon rendering includes thick black outlines of objects with flat color shading.
* Toon Shading for 3d models: Implement in WebGL, this includes two pass rendering of the models (outline shading and cell shading).
* Toon Shading for 2d images: Flat shading or cel Shading is achieved by quantizing colors of the image using Median Cut algorithm. A Sobel Filter is applied to identify and highlight the edges of the objects in the image.
* Toon Shading for videos: Toon Shading for 2d images is applied to each frame of the video. The previous frame details is used to improve temporal cohernce between frames to reduce flickering between frames of the video.

### Directions
---
* Open index.html/index2d.html/indexVideo.html in any web browser.
* Open console (Ctrl + Shift + I) to monitor progress.
* For 2d images, drag and drop target 2d image onto canvas.

Note: In case, cross-origin data fetching is disabled in your browser, start a simple python HTTP Server using the following command.
```
python -m SimpleHTTPServer
```
Open localhost:8000 in the browser.

### Claims
---
Basic:
* Outline Highlights: 
    * Backface Culling technique (for 3d models)
    * Gradient Difference technique (for 2d images)
* Shading:
    * Cel Shader (for 3d models)
    * Median Cut (for 2d models)
* Compare different number of tone shading and Phong shading.
* Video abstraction:
    * Implementation of toon shading to video frames.
    * Improve temporal coherence between frames.

### Demo
---
[Toon Shading](http://rawgit.com/aakshayy/toonshader-webgl/master/index.html)

### Screencast
---
[Watch the screencast on YouTube]()