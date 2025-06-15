<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Confetti configuration
const confetti = ref(null);
const canvas = ref(null);
const particles = ref([]);
const particleCount = 200;

// Particle constructor
const Particle = function (x, y) {
    this.x = x;
    this.y = y;
    // Random between -2 and 2
    this.vx = Math.random() * 4 - 2;
    // Random between -1 and -3
    this.vy = Math.random() * -2 - 1;
    this.gravity = 0.05;
    this.size = Math.random() * 6 + 2;
    this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    this.opacity = 1;
    this.fadeSpeed = 0.01;

    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.opacity -= this.fadeSpeed;
    };

    this.draw = function (ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    };
};

const createParticles = () => {
    particles.value = [];
    for (let i = 0; i < particleCount; i++) {
        // Create particles at the center of the canvas
        const x = canvas.value.width / 2;
        const y = canvas.value.height / 2;
        particles.value.push(new Particle(x, y));
    }
};

const animate = () => {
    if (!canvas.value || !confetti.value) return;

    confetti.value.clearRect(0, 0, canvas.value.width, canvas.value.height);

    for (let i = 0; i < particles.value.length; i++) {
        const p = particles.value[i];
        p.update();
        p.draw(confetti.value);

        // Remove particles that are off screen or faded out
        if (p.opacity <= 0 || p.y > canvas.value.height) {
            particles.value.splice(i, 1);
            i--;
        }
    }

    // Continue animation if particles exist
    if (particles.value.length > 0) {
        requestAnimationFrame(animate);
    }
};

const resizeCanvas = () => {
    if (canvas.value) {
        canvas.value.width = window.innerWidth;
        canvas.value.height = window.innerHeight;
    }
};

onMounted(() => {
    canvas.value = document.getElementById('confetti-canvas');
    confetti.value = canvas.value.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start confetti animation
    createParticles();
    animate();

    // Add additional particles after a delay for a continuous effect
    setTimeout(() => {
        createParticles();
        animate();
    }, 500);

    setTimeout(() => {
        createParticles();
        animate();
    }, 1000);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
    <canvas id="confetti-canvas" class="confetti-canvas"></canvas>
</template>

<style scoped>
.confetti-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}
</style>