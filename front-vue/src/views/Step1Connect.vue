<script setup>
import { ref } from 'vue';
import apiService from '../services/apiService';
import AppButton from '../components/ui/AppButton.vue';
import InputField from '../components/ui/InputField.vue';
import BenefitsList from '../components/BenefitsList.vue';

const emit = defineEmits(['next-step', 'set-email']);
const email = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const newsletterConsent = ref(false);

// Define los beneficios que quieras mostrar
const benefitsList = [
    { text: "Access to 100+ GAMES for FREE thanks to ads" },
    { text: "Log In Across All Your Devices" },
    { text: "Skip the Line with Customer Support" }
];

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
            <!-- Header section now at the top -->
            <div class="header-section">
                <h1 class="title">Connect Your Account</h1>
                <p class="subtitle">...and unlock your benefits!</p>
            </div>

            <!-- Usando el componente de beneficios -->
            <BenefitsList :benefits="benefitsList" />

            <div class="form-section">
                <input type="email" v-model="email" class="email-input" placeholder="Email Address"
                    :class="{ 'error-input': errorMessage }" />
                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

                <div class="newsletter-option">
                    <input type="checkbox" id="newsletter" v-model="newsletterConsent" class="checkbox-input" />
                    <label for="newsletter" class="checkbox-label">
                        Send Me Offers, News, and Fun Stuff!
                    </label>
                </div>

                <button class="connect-button" @click="handleConnect" :disabled="isLoading">
                    <span v-if="isLoading" class="loader"></span>
                    <span v-else>Connect</span>
                </button>
            </div>

            <!-- Terms at the bottom -->
            <div class="terms-section">
                <p>By continuing, you agree to our
                    <a href="#" class="terms-link">Terms of Service</a> and
                    <a href="#" class="terms-link">Privacy Policy</a>.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.connect-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    background: linear-gradient(135deg, #3a4cb7 0%, #2e1d5b 100%);
    color: white;
}

.connect-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 2rem 0rem;
    max-width: 500px;
    margin: 0 auto;
    gap: 2rem;
}

/* Header section */
.header-section {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
    padding: 0.5rem;
}

.title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 1rem;
    opacity: 0.9;
}

/* Form section */
.form-section {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 0.5rem 1rem;
}

.email-input {
    padding: 1rem;
    border-radius: 8px;
    border: none;
    font-size: 1rem;
    background-color: white;
    width: 100%;
}

.error-input {
    border: 2px solid #e74c3c;
}

.error-message {
    color: #ffcccc;
    font-size: 0.85rem;
    margin-top: -0.8rem;
}

.newsletter-option {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    padding: 0.5rem 0;
}

.checkbox-input {
    width: 18px;
    height: 18px;
    accent-color: #4a6cf7;
}

.checkbox-label {
    font-size: 0.9rem;
}

.connect-button {
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

.connect-button:hover {
    background-color: rgba(255, 255, 255, 0.4);
}

.connect-button:disabled {
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

/* Terms section */
.terms-section {
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.8;
    margin-top: auto;
    padding: 0.5rem 1rem;
}

.terms-link {
    color: #a9c2ff;
    text-decoration: none;
}

.terms-link:hover {
    text-decoration: underline;
}

/* Desktop layout */
@media screen and (min-width: 1024px) {
    .connect-container {
        align-items: center;
        justify-content: center;
        min-height: 100vh;
    }

    .connect-content {
        max-width: 1200px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: 
            "benefits header"
            "terms form";
        padding: 3rem;
    }

    :deep(.benefits-section) {
        grid-area: benefits;
        margin-bottom: 0;
    }

    .header-section {
        grid-area: header;
        text-align: center;
        margin-top: 0;
        margin-bottom: 0;  
        padding: 0;  
    }

    .form-section {
        grid-area: form;
        padding: 0; 
        margin-top: -5rem;  
    }

    .terms-section {
        grid-area: terms;
        margin-top: auto;
        text-align: center;
        padding-left: 0;
        align-self: flex-end;
    }

    .title {
        font-size: 2.5rem;
        margin-bottom: 0.25rem;  
    }

    .subtitle {
        font-size: 1.1rem;
        margin-bottom: 1rem; 
    }
    
    .newsletter-option {
        margin: 0.25rem 0;  
        padding: 0.25rem 0;  
    }
}
</style>