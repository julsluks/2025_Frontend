<script setup>
import { ref } from 'vue';
import apiService from '../services/apiService';
import AppButton from '../components/ui/AppButton.vue';
import InputField from '../components/ui/InputField.vue';

const emit = defineEmits(['next-step', 'set-email']);
const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const handleConnect = async () => {
    errorMessage.value = '';

    if (!email.value) {
        errorMessage.value = 'Please enter your email address';
        return;
    }

    if (!validateEmail(email.value)) {
        errorMessage.value = 'Please enter a valid email address';
        return;
    }

    isLoading.value = true;

    try {
        await apiService.sendEmail(email.value);
        emit('set-email', email.value);
        emit('next-step');
    } catch (error) {
        errorMessage.value = error.error || 'Failed to send verification code. Please try again.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="connect-container">
        <div class="connect-content">
            <h1 class="title">Connect Your Account</h1>
            <p class="description">Enter your email address to get started</p>

            <form @submit.prevent="handleConnect" class="connect-form">
                <InputField v-model="email" type="email" label="Email" placeholder="name@example.com"
                    :error="errorMessage" />

                <AppButton :loading="isLoading" type="submit">
                    Connect
                </AppButton>
            </form>

            <div class="terms">
                <p>By continuing, you agree to our <a href="#" class="link">Terms of Service</a> and <a href="#"
                        class="link">Privacy Policy</a>.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.connect-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;
}

.connect-content {
    width: 100%;
    max-width: 400px;
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

.connect-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.terms {
    text-align: center;
    font-size: 0.875rem;
    color: var(--lighter-text);
}

.link {
    color: var(--primary-color);
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
}
</style>