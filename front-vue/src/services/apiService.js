// Usar rutas relativas en lugar de absolutas
const API_BASE = '/api';

/**
 * API service for interacting with the backend
 */
export default {
    /**
     * Sends email for verification
     * @param {string} email - User's email address
     * @returns {Promise<Object>} - Response data
     */
    sendEmail(email) {
        return fetch(`${API_BASE}/send-email?email=${encodeURIComponent(email)}`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            });
    },

    /**
     * Validates email verification code
     * @param {string} email - User's email address
     * @param {string} code - Verification code
     * @returns {Promise<Object>} - Response with user_id if successful
     */
    validateEmailCode(email, code) {
        return fetch(`${API_BASE}/validate-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            });
    },

    /**
     * Gets product information
     * @returns {Promise<Object>} - Product data
     */
    getProducts() {
        return fetch(`${API_BASE}/products`)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            });
    },

    /**
     * Starts a product trial
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Response data
     */
    startTrial(userId) {
        return fetch(`${API_BASE}/start-trial`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => Promise.reject(err));
                }
                return response.json();
            });
    }
};