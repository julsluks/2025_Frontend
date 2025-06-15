<script setup>
import { computed } from 'vue';

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    secondary: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'button'
    }
});

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
    <button :type="type" class="app-button" :class="{
        'loading': loading,
        'secondary': secondary,
        'disabled': isDisabled
    }" :disabled="isDisabled">
        <span v-if="loading" class="spinner"></span>
        <span :class="{ 'invisible': loading }">
            <slot></slot>
        </span>
    </button>
</template>

<style scoped>
.app-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background-color: var(--primary-color);
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: background-color var(--transition-speed), transform var(--transition-speed);
    overflow: hidden;
}

.app-button::after {
    content: '';
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    opacity: 1;
    transition: transform 0.4s, opacity 0.4s;
}

.app-button:not(.disabled):active::after {
    transform: scale(3);
    opacity: 0;
}

.app-button:hover:not(.disabled) {
    background-color: var(--primary-hover);
}

.app-button:active:not(.disabled) {
    transform: translateY(1px);
}

.app-button.secondary {
    color: var(--primary-color);
    background-color: transparent;
    border: 1px solid var(--primary-color);
}

.app-button.secondary:hover:not(.disabled) {
    background-color: rgba(74, 108, 247, 0.1);
}

.app-button.disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    position: absolute;
}

.invisible {
    visibility: visible;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>