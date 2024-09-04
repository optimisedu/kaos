//TODO
// 1. See how observers can be used to monitor mouse position and make changes
// 2. anti-alias. this is a very resource heavy approach and there are a lot of performance improvements that can be made to this early version
// 3. Create some nice canvas visual algorithms which affect params, frequency values, etc.

const can = document.getElementById('can');
const ctx = can.getContext('2d');
can.width = window.innerWidth;
can.height = window.innerHeight;

setInterval(draw, 1000 / 60);
const audioCtx = new AudioContext();
let osc = null; 
let lfo = null; 
let filter = null; 
let gain = null;
let isPlaying = false;

let mousePos = { x: 0, y: 0 };

function mouseMove(e) {
    mousePos = { x: e.offsetX, y: e.offsetY };
    console.log(mousePos);

    if (osc) { // Only update if the main oscillator exists
        if (mousePos.x <= 300 && mousePos.y <= 300) {
            osc.type = 'sine';
        } else if (mousePos.x > 300 && mousePos.y <= 300) {
            osc.type = 'square';
        } else if (mousePos.x <= 300 && mousePos.y > 300) {
            osc.type = 'triangle';
        } else {const can = document.getElementById('can');
const ctx = can.getContext('2d');
can.width = window.innerWidth;
can.height = window.innerHeight;

setInterval(draw, 1000 / 60);
const audioCtx = new AudioContext();
let osc = null; 
let lfo = null; 
let filter = null; 
let gain = null;
let isPlaying = false; 

let mousePos = { x: 0, y: 0 };

function mouseMove(e) {
    mousePos = { x: e.offsetX, y: e.offsetY };
    console.log(mousePos);

    if (osc) { 
        if (mousePos.x <= 300 && mousePos.y <= 300) {
            osc.type = 'sine';
            lfo.type = 'sawtooth';
            lfo.frequency.setValueAtTime(8, audioCtx.currentTime); 
        } else if (mousePos.x > 300 && mousePos.y <= 300) {
            osc.type = 'square';
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(6, audioCtx.currentTime); 
        } else if (mousePos.x <= 300 && mousePos.y > 300) {
            osc.type = 'triangle';
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(4, audioCtx.currentTime); 
        } else {
            osc.type = 'sawtooth';
            lfo.type = 'square';
            lfo.frequency.setValueAtTime(2, audioCtx.currentTime); 
        }
        console.log(osc);
    }
}

can.addEventListener('mousemove', mouseMove);

can.addEventListener('click', () => {
    if (!isPlaying) {

        osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);


        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(990, audioCtx.currentTime);

        lfo = audioCtx.createOscillator();


         gain = audioCtx.createGain();
        gain.gain.setValueAtTime(500, audioCtx.currentTime);


        lfo.connect(gain);
        

        gain.connect(filter.frequency);

        osc.connect(filter);


        filter.connect(audioCtx.destination);


        osc.start();
        lfo.start();
        
        isPlaying = true;
    } else {

        osc.stop();
        lfo.stop();

  
        osc.disconnect();
        lfo.disconnect();
        filter.disconnect();
        

        osc = null;
        lfo = null;
        filter = null;
        
        isPlaying = false;
    }
});

function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

