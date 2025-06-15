<template>
    <div class="benefits-section">
        <div 
            v-for="(benefit, index) in benefits" 
            :key="index" 
            class="benefit-item"
        >
            <div class="check-icon">✓</div>
            <div class="benefit-text">{{ benefit.text }}</div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    benefits: {
        type: Array,
        default: () => [
            { text: "Access to 100+ GAMES for FREE thanks to ads" },
            { text: "Log In Across All Your Devices" },
            { text: "Skip the Line with Customer Support" }
        ]
    }
});
</script>

<style scoped>
.benefits-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding-bottom: 1rem;
}

.benefit-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
}

.benefit-item:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.15);
}

.check-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #2ecc71;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.benefit-text {
    font-size: 0.9rem;
    line-height: 1.3;
}
</style>