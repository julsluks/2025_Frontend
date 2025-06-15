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
        <ConfettiEffect />

        <div class="success-content">
            <div class="success-icon">🎉</div>
            <h1 class="title">Congrats! You are now a subscriber!</h1>

            <div class="plan-details">
                <p>You've subscribed to the <strong>{{ selectedPlan.name }}</strong> plan</p>
                <p>Your free trial has started</p>
            </div>

            <div class="next-steps">
                <h2>What's next?</h2>
                <ul>
                    <li>Check your email for confirmation details</li>
                    <li>Download our mobile app to get started</li>
                    <li>Explore all the features included in your subscription</li>
                </ul>
            </div>

            <div class="action-buttons">
                <a href="#" class="primary-button">Go to dashboard</a>
                <a href="#" class="secondary-button">Explore features</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.success-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;
    overflow: hidden;
    position: relative;
}

.success-content {
    width: 100%;
    max-width: 480px;
    text-align: center;
    z-index: 2;
}

.success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-color);
}

.plan-details {
    background-color: var(--white);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--box-shadow);
}

.next-steps {
    text-align: left;
    margin-bottom: 2rem;
}

.next-steps h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.next-steps ul {
    padding-left: 1.5rem;
    color: var(--light-text);
}

.next-steps li {
    margin-bottom: 0.5rem;
}

.action-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.primary-button {
    display: block;
    padding: 0.75rem 1rem;
    background-color: var(--primary-color);
    color: white;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: background-color var(--transition-speed);
}

.primary-button:hover {
    background-color: var(--primary-hover);
}

.secondary-button {
    display: block;
    padding: 0.75rem 1rem;
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: background-color var(--transition-speed);
}

.secondary-button:hover {
    background-color: rgba(74, 108, 247, 0.1);
}
</style>