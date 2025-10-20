const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const { WaveFile } = require('wavefile');

const assetsDir = path.join(__dirname, '..', 'assets');
const imagesDir = path.join(assetsDir, 'images');
const soundsDir = path.join(assetsDir, 'sounds');

function generatePlayerImage() {
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 32, 32);

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(imagesDir, 'player.png'), buffer);
    console.log('Generated player.png');
}

function generateTestSound() {
    const wav = new WaveFile();
    const duration = 0.5; // seconds
    const sampleRate = 44100;
    const numSamples = Math.floor(duration * sampleRate);
    const samples = new Int16Array(numSamples);

    const frequency = 440; // A4 note
    for (let i = 0; i < numSamples; i++) {
        samples[i] = Math.sin(2 * Math.PI * frequency * (i / sampleRate)) * 32767;
    }

    wav.fromScratch(1, sampleRate, '16', samples);
    fs.writeFileSync(path.join(soundsDir, 'test_sound.wav'), wav.toBuffer());
    console.log('Generated test_sound.wav');
}

// Create directories if they don't exist
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
if (!fs.existsSync(soundsDir)) fs.mkdirSync(soundsDir, { recursive: true });

generatePlayerImage();
generateTestSound();

console.log('Dummy assets generated successfully.');
