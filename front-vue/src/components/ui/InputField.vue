<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    error: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const hasError = computed(() => Boolean(props.error));

const updateValue = (event) => {
    emit('update:modelValue', event.target.value);
};
</script>

<template>
    <div class="input-container">
        <label v-if="label" class="input-label">{{ label }}</label>
        <input :type="type" :value="modelValue" @input="updateValue" :placeholder="placeholder" class="input-field"
            :class="{ 'error': hasError }" />
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<style scoped>
.input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.input-label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: var(--light-text);
}

.input-field {
    font-size: 1rem;
    padding: 0.875rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--white);
    transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.input-field:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
}

.input-field.error {
    border-color: var(--error-color);
}

.error-message {
    font-size: 0.75rem;
    color: var(--error-color);
    margin-top: 0.5rem;
}
</style>