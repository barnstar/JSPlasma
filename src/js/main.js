(function (){
    var CanvasTextureMapAnimator = require('./plasma.js').CanvasTextureMapAnimator;

    //30fps at 512x512
    let plasma = new CanvasTextureMapAnimator('backgroundCanvas', 30, 512);

    var speedSlider = document.getElementById('speedSlider');
    speedSlider.oninput = () => {
        plasma.setSpeed(speedSlider.value);
    };

    var scaleSlider = document.getElementById('scaleSlider');
    scaleSlider.oninput = () => {
        plasma.setScale(scaleSlider.value);
    };

    plasma.configureColorButtons("controls");

    window.onload = () => {
        plasma.run();
    };
})();