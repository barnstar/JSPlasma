'use strict';

var Shaders = require("./texture").Shaders;

class Point
{
    constructor(x,y) {
        this._x = x;
        this._y = y;
    }

    get x() { return this._x; }
    get y() { return this._y; }
};

class TextureMap
{
    constructor(width, height) {
        this._bitmap = new Float32Array(width * height);
        this._width = width;
        this._height = height;
    }

    get w() { return this._width; }
    get h() { return this._height; }
    get bitmap() { return this._bitmap; };
};


class CanvasTextureMapAnimator
{
    stepInc          = 0.1; //The "speed" of movement
    scale            = 30; //Larger means a shorter period on the sinusoids
    lastFrameTime    = 0;
    colIndex         = 0;
    textureSize      = 512;
    delay            = 1000 / 30;
    colorTransform   = undefined;
    textureGenerator = undefined;
    bgCanvas         = undefined;
    bgContext        = undefined;

    constructor(canvasId, framerate, canvasSize) {
        this.bgCanvas = document.getElementById(canvasId)
        this.bgContext = this.bgCanvas.getContext('2d');

        this.textureSize = canvasSize;
        this.delay = 1000 / framerate;

        this.colorTransform = Shaders.colorTransforms[0];
        this.textureGenerator = Shaders.textureGenerators.plasma;
    }


    run() {
        let size = this.textureSize;
        this.bgCanvas.width = size;
        this.bgCanvas.height = size;

        //Our render buffer.  This should match the canvas size
        let plasmaTextureMap = new TextureMap(size, size);
        console.log("Starting...");
        this.bgContext.fillRect(0, 0, size, size);
        this.render(plasmaTextureMap, this.textureGenerator, this.delay, 0, Math.random());
    }

    //Renders the textureMap with results of a pixel shader function.
    //This assumes the pixel shader deals with normalized co-ordinates ([0,0] -> [1,1])
    renderTexture(textureMap, step, scale, generator) {
        for (let y = 0; y < textureMap.h; y++) {
            for (let x = 0; x < textureMap.w; x++) {
                let offset = y * textureMap.w + x;
                let u = x / textureMap.w;
                let v = y / textureMap.h;
                textureMap.bitmap[offset] = generator(u, v, step, scale);;
            }
        }
    }

    //Applies a the textureMap to the canvas using the supplied color transfor to
    //transform the intensity values to an RGB colour
    //The tranform function takes a pixel location from the on-screen buffer and
    //a scalar normalized value, and writes out an RBGA value.
    renderWithColorTransform(context, canvas, textureMap, colorTransform) {
        let img = context.getImageData(0, 0, canvas.width, canvas.height);
        let rx = textureMap.w / canvas.width;
        let ry = textureMap.h / canvas.height;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let tx = Math.floor(rx * x);
                let ty = Math.floor(ry * y);
                let txOffset = ty * textureMap.w + tx;

                let v = textureMap.bitmap[txOffset];

                let imgOffset = (y * canvas.width + x) * 4;
                colorTransform(img.data, imgOffset, v);
            }
        }
        context.putImageData(img, 0, 0);
    }

    //Main animation loop.
    render(textureMap, textureGenerator, delay, step) {
        let frameTime = new Date().getTime();
        let nextStep = step;

        if (this.lastFrameTime == 0 || this.lastFrameTime + this.delay < frameTime) {
            this.renderTexture(textureMap, step, this.scale, textureGenerator);
            this.renderWithColorTransform(this.bgContext, this.bgCanvas, textureMap, this.colorTransform);
            this.lastFrameTime = frameTime;
            nextStep = this.stepInc + step;
            requestAnimationFrame(() => {
                if(this.stepInc > 0) {
                    this.render(textureMap, textureGenerator, delay, nextStep);
                }else{
                    console.log("Stopping...");
                }
            });
        }
    }

    renderColorMap(context, canvas, size, colorTransform)
    {
        canvas.width = size;
        canvas.height = size;
        let gradientTexture = new TextureMap(size, size);
        this.renderTexture(gradientTexture, 0, size/4, Shaders.textureGenerators.plasma);
        this.renderWithColorTransform(context, canvas, gradientTexture, colorTransform);
    }

    setSpeed(speed) {
        let restart = (this.stepInc == 0);
        this.stepInc = speed / 40;
        if(restart) {
            this.lastFrameTime = 0;
            this.run();
        }
    }

    setScale(scale) {
        this.scale = scale;
    }

    configureColorButtons(containerId)
    {
        const size = 40;
        let container = document.getElementById(containerId);

        for(let colorTransform of Shaders.colorTransforms){
            let div = document.createElement("div");
            div.classList.add("colorButton");
            let canvas = document.createElement("canvas");
            canvas.classList.add("fillCanvas");

            div.appendChild(canvas);
            container.appendChild(div);

            let context = canvas.getContext('2d');
            context.fillRect(0, 0, canvas.width, canvas.height);

            this.renderColorMap(context, canvas, size, colorTransform);
            canvas.onclick = ()=> {
                this.colorTransform = colorTransform;
                if(this.stepInc == 0) {
                    this.run();
                }
            }
        }
    }
};

module.exports.CanvasTextureMapAnimator = CanvasTextureMapAnimator;


