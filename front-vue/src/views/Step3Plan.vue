<script setup>
import { ref, onMounted } from 'vue';
import apiService from '../services/apiService';
import AppButton from '../components/ui/AppButton.vue';
import PlanCard from '../components/ui/PlanCard.vue';

const props = defineProps({
    userId: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['next-step', 'set-plan']);

const plans = ref(null);
const selectedPlan = ref(null);
const isLoading = ref(false);
const errorMessage = ref('');
const currency = ref('USD'); // Default currency

const loadPlans = async () => {
    isLoading.value = true;
    try {
        const response = await apiService.getProducts();
        plans.value = response;
    } catch (error) {
        errorMessage.value = 'Failed to load subscription plans. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

const toggleCurrency = () => {
    currency.value = currency.value === 'USD' ? 'EUR' : 'USD';
};

const handleStartTrial = async () => {
    if (!selectedPlan.value) {
        errorMessage.value = 'Please select a plan to continue';
        return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
        await apiService.startTrial(props.userId);
        emit('set-plan', {
            ...selectedPlan.value,
            currency: currency.value
        });
        emit('next-step');
    } catch (error) {
        errorMessage.value = error.error || 'Failed to start trial. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

onMounted(loadPlans);
</script>

<template>
    <div class="plan-container">
        <div class="plan-content">
            <button class="back-button" @click="$emit('previous-step')">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            
            <h1 class="title">Choose your plan</h1>
            
            <!-- Botón para cambiar moneda -->
            <div class="currency-selector">
                <button class="currency-toggle" @click="toggleCurrency">
                    <span :class="{ active: currency === 'USD' }">USD</span>
                    <span class="divider">|</span>
                    <span :class="{ active: currency === 'EUR' }">EUR</span>
                </button>
            </div>
            
            <div v-if="plans" class="plans-container">
                <!-- Plan Anual (destacado) -->
                <div class="plan-card featured" 
                    :class="{'selected': selectedPlan === 'yearly'}" 
                    @click="selectedPlan = 'yearly'">
                    <div class="plan-selector">
                        <div class="radio-circle" :class="{'selected': selectedPlan === 'yearly'}"></div>
                    </div>
                    <div class="plan-info-container">
                        <div class="plan-details">
                            <div class="plan-badge">BEST VALUE</div>
                            <div class="plan-name">Annual</div>
                        </div>
                        <div class="plan-pricing">
                            <div class="plan-price">
                                {{ currency === 'USD' ? '$' : '€' }} {{ currency === 'USD' ? plans.year.price : (Number(plans.year.price) * 0.93).toFixed(2) }}
                                <span class="plan-period">/year</span>
                            </div>
                            <div class="plan-billing">Billed annually</div>
                            <div class="plan-trial">{{ plans.year.trial_days }}-day free trial</div>
                        </div>
                    </div>
                    <div v-if="true" class="savings-badge">Save 20%</div>
                </div>

                <!-- Plan Mensual -->
                <div class="plan-card" 
                    :class="{'selected': selectedPlan === 'monthly'}" 
                    @click="selectedPlan = 'monthly'">
                    <div class="plan-selector">
                        <div class="radio-circle" :class="{'selected': selectedPlan === 'monthly'}"></div>
                    </div>
                    <div class="plan-info-container">
                        <div class="plan-name">Monthly</div>
                        <div class="plan-pricing">
                            <div class="plan-price">
                                {{ currency === 'USD' ? '$' : '€' }} {{ currency === 'USD' ? plans.monthly.price : (Number(plans.monthly.price) * 0.93).toFixed(2) }}
                                <span class="plan-period">/month</span>
                            </div>
                            <div class="plan-billing">Billed monthly</div>
                            <div class="plan-trial">{{ plans.monthly.trial_days }}-day free trial</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="isLoading" class="loading-plans">
                Loading subscription plans...
            </div>

            <div class="cancel-note">Cancel anytime.</div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <button 
                class="trial-button" 
                :disabled="!selectedPlan || isLoading" 
                @click="handleStartTrial"
            >
                <span v-if="isLoading" class="loader"></span>
                <span v-else>Start my free trial</span>
            </button>

            <div class="footer-links">
                <a href="#" class="footer-link">Privacy Policy</a>
                <span class="link-divider">|</span>
                <a href="#" class="footer-link">Terms of Service</a>
                <span class="link-divider">|</span>
                <a href="#" class="footer-link">Restore</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.plan-container {
    min-height: 100vh;
    width: 100%;
    display: flex;
    background: linear-gradient(135deg, #3a4cb7 0%, #2e1d5b 100%);
    color: white;
}

.plan-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    position: relative;
}

.back-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.title {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    margin: 5rem 0 2.5rem; /* Aumentado de 3.5rem a 5rem para más separación del botón */
}

.currency-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.currency-toggle {
    background-color: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 20px;
    padding: 0.5rem 1rem;
    color: white;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.currency-toggle:hover {
    background-color: rgba(255, 255, 255, 0.25);
}

.currency-toggle .divider {
    opacity: 0.5;
}

.currency-toggle span.active {
    color: #FFD166;
    font-weight: 600;
    position: relative;
}

.currency-toggle span.active::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #FFD166;
    border-radius: 2px;
}

.plans-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
}

.plan-card {
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 1.25rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-bottom: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s, box-shadow 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.plan-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

/* Aplicamos borde arcoíris SOLO cuando está seleccionado */
.plan-card.selected {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(to right, #5e4cbf, #5e4cbf),
        linear-gradient(45deg, #FF5F6D, #FFC371, #6EE2F5, #8D55EC, #5E4CBF);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.plan-card.featured {
    background-color: #5e4cbf;
    padding: 1.5rem;
}

/* Borde especial para featured + selected */
.plan-card.featured.selected {
    border: 2px solid transparent;
    background-image: 
        linear-gradient(to right, #5e4cbf, #5e4cbf),
        linear-gradient(45deg, #FFC371, #FF5F6D, #5E4CBF, #6EE2F5, #8D55EC, #FF5F6D);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

.plan-card.featured:hover {
    transform: scale(1.05) translateY(-3px);
}

.plan-selector {
    margin-right: 1rem;
}

.radio-circle {
    width: 26px;
    height: 26px;
    border: 2.5px solid white;
    border-radius: 50%;
    position: relative;
    transition: all 0.2s;
}

.radio-circle.selected::after {
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    background-color: #4cd963;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 6px #4cd963;
}

.plan-info-container {
    flex: 1;
    display: flex;
    justify-content: space-between;
}

.plan-details {
    display: flex;
    flex-direction: column;
}

.plan-badge {
    font-size: 0.8rem;
    font-weight: 700;
    color: #4cd963;
    margin-bottom: 0.3rem;
    letter-spacing: 0.05rem;
    text-shadow: 0 0 8px rgba(76, 217, 99, 0.4);
}

.plan-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
}

.plan-pricing {
    text-align: right;
}

.plan-price {
    font-size: 1.3rem;
    font-weight: 700;
}

.plan-period {
    font-size: 1rem;
    font-weight: 400;
}

.plan-billing {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 0.2rem;
}

.plan-trial {
    font-size: 0.9rem;
    margin-top: 0.6rem;
    color: #FFD166; /* Color amarillo que coincide con el botón */
    background-color: #2e1d5b; /* Morado oscuro como el fondo */
    display: inline-block;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    font-weight: 500;
}

.savings-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #28c6db, #4cd963);
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.4rem 0.8rem;
    border-bottom-left-radius: 10px;
    box-shadow: 0 2px 8px rgba(40, 198, 219, 0.4);
}

.cancel-note {
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
}

.trial-button {
    background-color: #FFD166;
    color: #333;
    border: none;
    border-radius: 8px;
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 2rem;
    transition: background-color 0.3s;
}

.trial-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.error-message {
    color: #ff6b6b;
    text-align: center;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.loader {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(51, 51, 51, 0.3);
    border-top-color: #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.footer-links {
    text-align: center;
    margin-top: auto;
    padding: 1rem 0;
    font-size: 0.85rem;
    opacity: 0.7;
}

.footer-link {
    color: white;
    text-decoration: none;
}

.link-divider {
    margin: 0 0.5rem;
}

/* Estilos para desktop */
@media screen and (min-width: 1024px) {
    .plan-container {
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }

    .plan-content {
        max-width: 900px;
        padding: 3rem;
    }

    .back-button {
        top: 2rem;
        left: 2rem;
        width: 50px;
        height: 50px;
    }

    .title {
        font-size: 2.5rem;
        margin-top: 0;
    }

    .currency-selector {
        position: absolute;
        top: 2rem;
        right: 2rem;
    }

    .plans-container {
        flex-direction: row;
        gap: 2rem;
    }

    .plan-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        padding: 1.5rem;
        margin-bottom: 0;
        height: auto;
        min-height: 150px;
        transition: transform 0.3s, box-shadow 0.3s;
    }

    .plan-card:hover {
        transform: translateY(-5px);
    }

    .plan-card.featured {
        transform: scale(1);
    }

    .plan-card.featured:hover {
        transform: translateY(-5px) scale(1.02);
    }

    .plan-selector {
        display: flex;
        justify-content: flex-start;
        margin-right: 1rem;
        margin-bottom: 0;
    }

    .plan-info-container {
        flex: 1;
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
    }

    .plan-details {
        margin-bottom: 0;
        align-items: flex-start;
    }

    .plan-name {
        font-size: 1.5rem;
        margin: 0.25rem 0;
    }

    .plan-pricing {
        text-align: right;
        margin-bottom: 0;
    }

    .plan-price {
        font-size: 1.5rem;
        margin-bottom: 0.25rem;
    }

    .plan-period {
        font-size: 1rem;
    }

    .plan-billing {
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }

    .plan-trial {
        width: auto;
        text-align: right;
        padding: 0.3rem 0.6rem;
    }

    .savings-badge {
        padding: 0.4rem 0.8rem;
        font-size: 0.85rem;
        border-bottom-left-radius: 10px;
    }

    .cancel-note {
        font-size: 1rem;
        margin: 2rem 0;
    }

    .trial-button {
        max-width: 400px;
        margin: 0 auto 3rem;
        padding: 1.2rem;
        font-size: 1.2rem;
    }

    .footer-links {
        font-size: 0.95rem;
    }
}
</style>