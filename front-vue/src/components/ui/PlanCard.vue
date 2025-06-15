<script setup>
defineProps({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: [String, Number],
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    trialDays: {
        type: Number,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    },
    popular: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['select']);

const currencySymbol = {
    USD: '$',
    EUR: '€'
};
</script>

<template>
    <div class="plan-card" :class="{
        'selected': selected,
        'popular': popular
    }" @click="emit('select')">
        <div v-if="popular" class="popular-badge">Most Popular</div>

        <div class="card-header">
            <h3 class="plan-name">{{ name }}</h3>
            <div class="plan-price">
                <span class="currency">{{ currencySymbol[currency] }}</span>
                <span class="amount">{{ price }}</span>
                <span class="period">/{{ type === 'monthly' ? 'month' : 'year' }}</span>
            </div>
        </div>

        <div class="card-content">
            <div class="trial-info">
                <div class="trial-days">{{ trialDays }}-day free trial</div>
                <div class="trial-note">Cancel anytime during trial</div>
            </div>

            <ul class="features">
                <li>All premium features</li>
                <li>Priority support</li>
                <li v-if="type === 'yearly'">Save {{ currency === 'USD' ? '$' : '€' }}{{ ((Number(price) / 12) *
                    3).toFixed(2) }} per year</li>
            </ul>
        </div>

        <div class="radio-indicator">
            <div class="radio-inner" :class="{ 'checked': selected }"></div>
        </div>
    </div>
</template>

<style scoped>
.plan-card {
    position: relative;
    padding: 1.5rem;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--white);
    cursor: pointer;
    transition: border-color var(--transition-speed), transform var(--transition-speed);
}

.plan-card:hover {
    border-color: var(--primary-color);
    transform: translateY(-2px);
}

.plan-card.selected {
    border-color: var(--primary-color);
}

.plan-card.popular {
    border-color: var(--primary-color);
}

.popular-badge {
    position: absolute;
    top: -0.75rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 1rem;
}

.card-header {
    margin-bottom: 1.5rem;
}

.plan-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.plan-price {
    display: flex;
    align-items: baseline;
}

.currency {
    font-size: 1.25rem;
    font-weight: 600;
}

.amount {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0.25rem;
    color: var(--text-color);
}

.period {
    color: var(--light-text);
    font-size: 0.875rem;
}

.trial-info {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.trial-days {
    font-weight: 600;
    color: var(--primary-color);
}

.trial-note {
    font-size: 0.875rem;
    color: var(--light-text);
}

.features {
    list-style-type: none;
    padding-left: 0.5rem;
}

.features li {
    position: relative;
    padding-left: 1rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
}

.features li::before {
    content: '✓';
    position: absolute;
    left: -0.5rem;
    color: var(--success-color);
    font-weight: bold;
}

.radio-indicator {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color var(--transition-speed);
}

.plan-card.selected .radio-indicator {
    border-color: var(--primary-color);
}

.radio-inner {
    width: 0.75rem;
    height: 0.75rem;
    background-color: var(--primary-color);
    border-radius: 50%;
    transform: scale(0);
    transition: transform var(--transition-speed);
}

.radio-inner.checked {
    transform: scale(1);
}
</style>