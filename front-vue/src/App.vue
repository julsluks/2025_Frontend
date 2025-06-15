<script setup>
import { ref } from 'vue';
import Step1Connect from './views/Step1Connect.vue';
import Step2Verify from './views/Step2Verify.vue';
import Step3Plan from './views/Step3Plan.vue';
import Step4Success from './views/Step4Success.vue';

const currentStep = ref(1);
const email = ref('');
const userId = ref(null);
const selectedPlan = ref(null);

const goToStep = (step) => {
  currentStep.value = step;
};

const setEmail = (value) => {
  email.value = value;
};

const setUserId = (id) => {
  userId.value = id;
};

const setPlan = (plan) => {
  selectedPlan.value = plan;
};
</script>

<template>
  <div class="app-container">
    <Step1Connect 
      v-if="currentStep === 1" 
      @next-step="goToStep(2)"
      @set-email="setEmail"
    />
    <Step2Verify 
      v-else-if="currentStep === 2" 
      :email="email"
      @next-step="goToStep(3)"
      @set-user-id="setUserId"
      @previous-step="goToStep(1)"
    />
    <Step3Plan 
      v-else-if="currentStep === 3" 
      :user-id="userId"
      @next-step="goToStep(4)"
      @set-plan="setPlan"
    />
    <Step4Success 
      v-else-if="currentStep === 4" 
      :selected-plan="selectedPlan"
    />
  </div>
</template>

<style>
:root {
  --primary-color: #4a6cf7;
  --primary-hover: #3a5ce5;
  --error-color: #e74c3c;
  --success-color: #2ecc71;
  --text-color: #333333;
  --light-text: #666666;
  --lighter-text: #999999;
  --border-color: #e1e1e1;
  --background-light: #f8f9fa;
  --white: #ffffff;
  --box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --border-radius: 8px;
  --transition-speed: 0.3s;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
}

body, html {
  height: 100%;
  width: 100%;
}

.app-container {
  height: 100vh;
  width: 100%;
}
</style>
