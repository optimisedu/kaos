const can = document.getElementById('can');
const ctx = can.getContext('2d');
can.width = window.innerWidth;
can.height = window.innerHeight;

setInterval(draw, 1000 / 60);
const audioCtx = new AudioContext();
let osc = null; // Main oscillator
let lfo = null; // Low-Frequency Oscillator
let filter = null; // Lowpass filter
let isPlaying = false; // Track whether the oscillator is playing

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
        } else {
            osc.type = 'sawtooth';
        }
        console.log(osc);
    }
}

can.addEventListener('mousemove', mouseMove);

can.addEventListener('click', () => {
    if (!isPlaying) {
        // Create the main oscillator
        osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);

        // Create the lowpass filter
        filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(880, audioCtx.currentTime); // Initial cutoff frequency

        // Create the LFO
        lfo = audioCtx.createOscillator();
        lfo.frequency.setValueAtTime(8, audioCtx.currentTime); // LFO frequency (2 Hz)
        
        // Create a gain node to control the depth of LFO modulation
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.setValueAtTime(500, audioCtx.currentTime); // LFO modulation depth

        // Connect the LFO to the gain node
        lfo.connect(lfoGain);
        
        // Connect the gain node to the filter's frequency parameter
        lfoGain.connect(filter.frequency);

        // Connect the main oscillator to the filter
        osc.connect(filter);

        // Connect the filter to the destination (speakers)
        filter.connect(audioCtx.destination);

        // Start the oscillator and the LFO
        osc.start();
        lfo.start();
        
        isPlaying = true;
    } else {
        // Stop the oscillator and the LFO
        osc.stop();
        lfo.stop();

        // Disconnect everything
        osc.disconnect();
        lfo.disconnect();
        filter.disconnect();
        
        // Clear the references
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
