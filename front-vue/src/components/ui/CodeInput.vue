<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    length: {
        type: Number,
        default: 6
    },
    error: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const codeInputs = ref([...Array(props.length)].map(() => ''));
const inputRefs = ref([]);

const hasError = computed(() => Boolean(props.error));

watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue) {
            const codeArray = newValue.split('').slice(0, props.length);
            codeInputs.value = [...codeArray, ...Array(props.length - codeArray.length).fill('')];
        } else {
            codeInputs.value = [...Array(props.length)].map(() => '');
        }
    },
    { immediate: true }
);

watch(
    codeInputs,
    (newValue) => {
        emit('update:modelValue', newValue.join(''));
    },
    { deep: true }
);

const handleInput = (index, event) => {
    const value = event.target.value;

    // Allow only digits
    if (!/^\d*$/.test(value)) {
        event.target.value = codeInputs.value[index];
        return;
    }

    // Take only the last character if someone pastes multiple digits
    const digit = value.slice(-1);
    codeInputs.value[index] = digit;

    // Move to next input if a digit was entered
    if (digit && index < props.length - 1) {
        inputRefs.value[index + 1].focus();
    }
};

const handleKeydown = (index, event) => {
    if (event.key === 'Backspace' && !codeInputs.value[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs.value[index - 1].focus();
    }
};

const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text/plain')
        .replace(/\D/g, '') // Remove non-digits
        .slice(0, props.length); // Take only required digits

    if (pasteData) {
        // Fill the inputs with pasted digits
        for (let i = 0; i < pasteData.length; i++) {
            if (i < props.length) {
                codeInputs.value[i] = pasteData[i];
            }
        }

        // Focus the next empty input or the last one
        const nextEmptyIndex = codeInputs.value.findIndex(val => val === '');
        if (nextEmptyIndex !== -1) {
            inputRefs.value[nextEmptyIndex].focus();
        } else if (inputRefs.value.length) {
            inputRefs.value[props.length - 1].focus();
        }
    }
};
</script>

<template>
    <div class="code-input-container">
        <div class="inputs-wrapper" :class="{ 'has-error': hasError }">
            <input v-for="(digit, index) in codeInputs" :key="index" ref="inputRefs" type="text" inputmode="numeric"
                pattern="[0-9]*" maxlength="1" :value="digit" @input="handleInput(index, $event)"
                @keydown="handleKeydown(index, $event)" @paste="handlePaste" class="code-digit" />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
    </div>
</template>

<style scoped>
.code-input-container {
    width: 100%;
}

.inputs-wrapper {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 0.5rem;
}

.code-digit {
    width: 100%;
    height: 4rem;
    font-size: 1.5rem;
    text-align: center;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--white);
    transition: border-color var(--transition-speed), box-shadow var(--transition-speed);
}

.code-digit:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(74, 108, 247, 0.2);
}

.has-error .code-digit {
    border-color: var(--error-color);
}

.error-message {
    font-size: 0.75rem;
    color: var(--error-color);
    margin-top: 0.5rem;
    text-align: center;
}
</style>