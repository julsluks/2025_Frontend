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
            <h1 class="title">Choose your plan</h1>
            <p class="description">Select the subscription plan that works best for you</p>

            <div class="currency-toggle">
                <span :class="{ active: currency === 'USD' }">USD</span>
                <button @click="toggleCurrency" class="toggle-button">
                    <div class="toggle-slider" :class="{ 'toggle-right': currency === 'EUR' }"></div>
                </button>
                <span :class="{ active: currency === 'EUR' }">EUR</span>
            </div>

            <div v-if="plans" class="plans-container">
                <PlanCard type="monthly" :name="'Monthly'"
                    :price="currency === 'USD' ? plans.monthly.price : (Number(plans.monthly.price) * 0.93).toFixed(2)"
                    :currency="currency" :trial-days="plans.monthly.trial_days" :selected="selectedPlan === 'monthly'"
                    @select="selectedPlan = 'monthly'" />

                <div class="divider">or</div>

                <PlanCard type="yearly" :name="'Yearly'"
                    :price="currency === 'USD' ? plans.year.price : (Number(plans.year.price) * 0.93).toFixed(2)"
                    :currency="currency" :trial-days="plans.year.trial_days" :selected="selectedPlan === 'yearly'"
                    @select="selectedPlan = 'yearly'" :popular="true" />
            </div>

            <div v-else-if="isLoading" class="loading-plans">
                Loading subscription plans...
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div class="action-buttons">
                <AppButton :disabled="!selectedPlan" :loading="isLoading" @click="handleStartTrial">
                    Start my free trial
                </AppButton>
            </div>

            <div class="plan-info">
                <p>All plans include a free trial period. You won't be charged until the trial ends. You can cancel
                    anytime.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.plan-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1.5rem;
}

.plan-content {
    width: 100%;
    max-width: 480px;
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

.currency-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
}

.toggle-button {
    position: relative;
    width: 3.5rem;
    height: 1.75rem;
    background-color: var(--background-light);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    cursor: pointer;
}

.toggle-slider {
    position: absolute;
    top: 0.15rem;
    left: 0.15rem;
    width: 1.4rem;
    height: 1.4rem;
    background-color: var(--primary-color);
    border-radius: 50%;
    transition: transform 0.3s ease;
}

.toggle-right {
    transform: translateX(1.75rem);
}

.active {
    font-weight: 600;
    color: var(--primary-color);
}

.plans-container {
    margin-bottom: 2rem;
}

.divider {
    text-align: center;
    margin: 1rem 0;
    color: var(--lighter-text);
    font-size: 0.875rem;
}

.loading-plans {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    color: var(--light-text);
    font-style: italic;
}

.error-message {
    color: var(--error-color);
    margin-bottom: 1rem;
    text-align: center;
    font-size: 0.875rem;
}

.action-buttons {
    margin-bottom: 1.5rem;
}

.plan-info {
    font-size: 0.875rem;
    color: var(--lighter-text);
    text-align: center;
}
</style>