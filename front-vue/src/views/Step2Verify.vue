<script setup>
import { ref, computed } from 'vue';
import apiService from '../services/apiService';
import AppButton from '../components/ui/AppButton.vue';
import CodeInput from '../components/ui/CodeInput.vue';
import BenefitsList from '../components/BenefitsList.vue';

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

const benefitsList = [
    { text: "Access to 100+ GAMES for FREE thanks to ads" },
    { text: "Log In Across All Your Devices" },
    { text: "Skip the Line with Customer Support" }
];

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
                ← Modify email
            </button>

            <div class="header-section">
                <h1 class="title">Get Verified!</h1>
                <p class="description">
                    Enter the one-time code we sent to:<br>
                    <span class="email-highlight">{{ email }}</span>
                </p>
            </div>

            <!-- Beneficios -->
            <BenefitsList :benefits="benefitsList" />

            <form @submit.prevent="handleVerify" class="verify-form">
                <div class="code-container">
                    <CodeInput v-model="code" :error="errorMessage" />
                </div>

                <button type="submit" class="verify-button" :disabled="isLoading">
                    <span v-if="isLoading" class="loader"></span>
                    <span v-else>Verify</span>
                </button>

                <div class="resend-container">
                    <p class="resend-text">Didn't get an email? 
                        <button type="button" class="resend-button" :disabled="!canResend" @click="handleResendCode">
                            Resend Code
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.verify-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    background: linear-gradient(135deg, #3a4cb7 0%, #2e1d5b 100%);
    color: white;
    padding: 1.5rem;
}

.verify-content {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    padding-top: 3rem;
    gap: 1.5rem;
}

.back-button {
    position: absolute;
    top: 0;
    left: 0;
    border: 3px solid rgb(147, 84, 184);
    font-size: 0.9rem;
    color:  rgb(147, 84, 184);
    cursor: pointer;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: transparent;
}

.header-section {
    text-align: center;
    margin-bottom: 1rem;
    margin-top: 2.5rem; 
}

.title {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
}

.description {
    font-size: 1rem;
    opacity: 0.9;
    line-height: 1.5;
}

.email-highlight {
    color: #a9f75a;
    font-weight: 500;
}

.verify-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.code-container {
    margin-top: 1rem;
}

.verify-button {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
}

.verify-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.verify-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.resend-container {
    text-align: center;
    margin-top: auto; 
    padding-top: 2rem; 
}

.resend-text {
    font-size: 0.9rem;
    opacity: 0.9;
}

.resend-button {
    background: none;
    border: none;
    color: #a9c2ff;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    text-decoration: none;
}

.resend-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    text-decoration: none;
}

/* Estilo para desktop */
@media screen and (min-width: 1024px) {
    .verify-container {
        align-items: center;
        justify-content: center;
    }

    .verify-content {
        padding-top: 0;
        max-width: 1000px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            "back title"
            "benefits inputs";
        gap: 4.5rem;
    }

    .back-button {
        grid-area: back;
        width: fit-content;
        margin-top: 2rem;
    }

    .header-section {
        grid-area: title;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;
        padding-right: 2rem;
    }

    :deep(.benefits-section) {
        grid-area: benefits;
        margin-bottom: 0;
    }

    .verify-form {
        grid-area: inputs;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .code-container {
        order: 1;
    }

    .resend-container {
        order: 2;
        margin-top: 2rem;
        margin-bottom: 2rem;
    }

    .verify-button {
        order: 3;
        margin-top: auto;
    }

    /* Ajustes específicos para el layout */
    .title {
        font-size: 2.5rem;
    }

    .description {
        font-size: 1.1rem;
    }
}
</style>