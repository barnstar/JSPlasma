class Shaders {
    /*
    Take a scalar normalized value and map to a int8 RGB colour
    Intended to write directly to the on-screen pixel buffer

    @param px pixel buffer
    @param offset offset in the pixel buffer
    @param v normalized intensity value
    */
    static colorTransforms = [
        function (px, offset, v) {
            let r = 255 * (.5 + .5 * Math.sin(Math.PI * v));
            let g = 255 * (.5 + .5 * Math.cos(Math.PI * v));
            let b = 0;
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let r = 0;
            let g = 255 * (.5 + .5 * Math.cos(Math.PI * v));
            let b = 255 * (.5 + .5 * Math.sin(Math.PI * v));
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let r = 0 * (.5 + .5 * Math.sin(Math.PI * v));
            let g = 75 * (.5 + .5 * Math.sin(Math.PI * v + 2 * Math.PI / 3));
            let b = 255 * (.5 + .5 * Math.sin(Math.PI * v + 4 * Math.PI / 3));
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let c = .5 + .5 * Math.sin(Math.PI * v * 5);
            let r = 255 * c;
            let g = 255 * c;
            let b = 255 * c;
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let c = .5 + .5 * Math.sin(Math.PI * v * 3);
            let r = 255 * c;
            let g = 100-30 * c;
            let b = 255*Math.sqrt(v);
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let c = .5 + .5 * Math.sin(Math.PI * v * 3);
            let r = 255- 128 * c;
            let g = 255 * c;
            let b = 30 * c;
            let a = 255;
            px.set([r,g,b,a], offset)
        },

        function (px, offset, v) {
            let c = .5 + .5 * Math.sin(Math.PI * v * 3);
            let r = 30 * c;
            let g = 30 * c;
            let b = 255 * c;
            let a = 255;
            px.set([r,g,b,a], offset)
        },
        function (px, offset, v) {
            let c = .5 + .5 * Math.sin(Math.PI * v * 5);
            let r = 30 * c;
            let g = 255-255*c
            let b = 255 * c;
            let a = 255;
            px.set([r,g,b,a], offset)
        },
    ];

    /*
    Shader functions to create intesity maps.  The inputs are
    normalized uv texture co-ordinates.  The output is the
    intensity value
    */
    static textureGenerators = {
        plasma: (u, v, step, scale) => {
            let z = 0;
            z += Math.sin((u * scale + step));
            z += Math.sin(v * scale + step) * .5;
            z += Math.sin((u * scale + v * scale + step) *.5);
            let cx = u + .5 * Math.sin(step * .2);
            let cy = v + .5 * Math.cos(step * .33);
            z += Math.sin(Math.sqrt(scale * scale * (cx * cx + cy * cy) + 1) + step);
            z = z * .5;
            return z;
        },

        mandelbrot: (u, v, _, scale) => {
            let c = new Point(u,v);
            const iter = 50;
            scale = scale * .1;

            c.x = 1.3333 * (u - .7) * scale;
            c.y = (v - .5) * scale;

            let i = 0;
            let z = new Point(c.x, c.y);
            for (i = 0; i < iter; i++) {
                let x = (z.x * z.x - z.y * z.y) + c.x;
                let y = (z.y * z.x + z.x * z.y) + c.y;

                if ((x * x + y * y) > 4.0) break;
                z.x = x;
                z.y = y;
            }
            return i / iter;
        },

        gradient:(u) => {
            return u;
        }
    };

}

module.exports.Shaders = Shaders;



