<script setup>
import { ref, computed } from 'vue';
import apiService from '../services/apiService';
import AppButton from '../components/ui/AppButton.vue';
import CodeInput from '../components/ui/CodeInput.vue';

const props = defineProps({
    email: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['next-step', 'set-user-id', 'previous-step']);

const code = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);
const resendTimer = ref(null);

const canResend = computed(() => resendCooldown.value === 0);

const startResendTimer = () => {
    resendCooldown.value = 30;
    resendTimer.value = setInterval(() => {
        resendCooldown.value--;
        if (resendCooldown.value <= 0) {
            clearInterval(resendTimer.value);
            resendCooldown.value = 0;
        }
    }, 1000);
};

const handleVerify = async () => {
    errorMessage.value = '';

    if (!code.value || code.value.length !== 6) {
        errorMessage.value = 'Please enter the 6-digit code';
        return;
    }

    isLoading.value = true;

    try {
        const response = await apiService.validateEmailCode(props.email, code.value);
        emit('set-user-id', response.user_id);
        emit('next-step');
    } catch (error) {
        errorMessage.value = error.error || 'Invalid verification code. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

const handleResendCode = async () => {
    if (!canResend.value) return;

    errorMessage.value = '';
    isLoading.value = true;

    try {
        await apiService.sendEmail(props.email);
        startResendTimer();
    } catch (error) {
        errorMessage.value = error.error || 'Failed to resend code. Please try again later.';
    } finally {
        isLoading.value = false;
    }
};

const goBack = () => {
    emit('previous-step');
};

// Start the resend cooldown on component mount
startResendTimer();
</script>

<template>
    <div class="verify-container">
        <div class="verify-content">
            <button class="back-button" @click="goBack">
                ← Back
            </button>

            <h1 class="title">Get Verified!</h1>
            <p class="description">
                We sent a 6-digit code to <strong>{{ email }}</strong>
            </p>

            <form @submit.prevent="handleVerify" class="verify-form">
                <CodeInput v-model="code" :error="errorMessage" />

                <AppButton :loading="isLoading" type="submit">
                    Verify
                </AppButton>

                <button type="button" class="resend-button" :disabled="!canResend" @click="handleResendCode">
                    {{ canResend ? 'Resend code' : `Resend code (${resendCooldown}s)` }}
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.verify-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;
}

.verify-content {
    width: 100%;
    max-width: 400px;
    position: relative;
}

.back-button {
    position: absolute;
    top: -3rem;
    left: 0;
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--light-text);
    cursor: pointer;
    padding: 0.5rem 0;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-color);
}

.description {
    font-size: 1rem;
    color: var(--light-text);
    margin-bottom: 2rem;
}

.verify-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.resend-button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.5rem;
    margin-top: 0.5rem;
    text-align: center;
}

.resend-button:disabled {
    color: var(--lighter-text);
    cursor: not-allowed;
}
</style>