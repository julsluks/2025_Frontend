<script setup>
import { onMounted } from 'vue';
import ConfettiEffect from '../components/ui/ConfettiEffect.vue';

defineProps({
    selectedPlan: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <div class="success-container">
        <!-- Efecto de confeti existente -->
        <ConfettiEffect />

        <!-- Nuevo diseño según la imagen de referencia -->
        <div class="success-content">
            <h1 class="title">
                Congrats! You're now a 
                <span class="highlight">subscriber!</span>
            </h1>
            <p class="subtitle">Explore your membership now.</p>
            
            <!-- Ilustración de fuegos artificiales -->
            <div class="fireworks-illustration">
                <!-- Añadidos gráficamente mediante CSS para simular la imagen de referencia -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Cambiado de center a flex-start */
    min-height: 100vh;
    width: 100%;
    background: linear-gradient(135deg, #3a4cb7 0%, #2e1d5b 100%);
    color: white;
    padding: 1.5rem;
    overflow: hidden;
    position: relative;
}

.success-content {
    width: 100%;
    max-width: 480px;
    text-align: center;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15%; /* Espacio para la ilustración */
    padding-top: 15vh; /* Aumentado de 10vh a 15vh para mover el contenido más arriba */
}

.title {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.3;
    margin-bottom: 1rem;
    color: white;
    max-width: 80%;
    margin-top: 2rem; /* Añadido margen superior */
}

.highlight {
    color: #FFD166; /* Color amarillo similar al botón de la pantalla anterior */
    display: inline;
}

.subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 4rem;
}

/* Ilustración de fuegos artificiales */
.fireworks-illustration {
    position: absolute;
    bottom: 20%; /* Aumentado de 15% a 20% para moverlo más arriba */
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: 220px;
}

/* Fuego artificial principal azul */
.fireworks-illustration::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, #28c6db 0%, transparent 70%);
    border-radius: 50%;
    box-shadow: 
        0 0 20px #28c6db,
        0 0 40px rgba(40, 198, 219, 0.6);
    z-index: 1;
}

/* Fuego artificial secundario amarillo */
.fireworks-illustration::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90px;
    height: 90px;
    background: radial-gradient(circle, #FFD166 0%, transparent 70%);
    border-radius: 50%;
    box-shadow: 
        0 0 15px #FFD166,
        0 0 30px rgba(255, 209, 102, 0.6);
    z-index: 0;
}

/* Líneas de fuegos artificiales con pseudo-elementos */
@keyframes fireLines {
    0% { transform: scale(0.8); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(0.8); opacity: 0.7; }
}

/* Confeti volador */
.confetti {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 2px;
}

/* Creamos 12 confetis con diferentes colores y posiciones */
@keyframes float {
    0% { transform: translateY(0) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
}

@media (min-width: 768px) {
    .success-content {
        padding-top: 20vh; /* Aumentado para pantallas más grandes */
    }
    
    .title {
        font-size: 2.5rem;
        margin-top: 0; /* Ajustado para pantallas grandes */
    }
    
    .fireworks-illustration {
        width: 300px;
        height: 300px;
    }

    .fireworks-illustration::before {
        width: 160px;
        height: 160px;
    }

    .fireworks-illustration::after {
        width: 120px;
        height: 120px;
    }
}
</style>