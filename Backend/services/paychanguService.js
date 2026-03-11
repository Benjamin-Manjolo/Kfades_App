/**
 * Paychangu Service - External payment API integration
 */

const axios = require("axios");

class PaychanguService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.paychangu.com",
      headers: {
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
  }

  /**
   * Initiate payment
   */
  async initiateTransaction(paymentData) {
  try {
    const payload = {
      amount: paymentData.amount,
      currency: "MWK",
      tx_ref: paymentData.tx_ref,
      first_name: paymentData.first_name,
      last_name: paymentData.last_name,
      email: paymentData.email,
      payment_methods: ["mobile_money", "card"],
      callback_url: paymentData.callback_url || process.env.CALLBACK_URL,
      return_url: paymentData.return_url || process.env.RETURN_URL,
    };

    // 👇 Log the payload and key before sending
    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    console.log('Using key:', process.env.PAYCHANGU_SECRET_KEY ? '✅ Key exists' : '❌ Key is MISSING');

    const response = await this.client.post("/payment", payload);
    return response.data;

  } catch (error) {
    // 👇 Log everything raw
    console.log('Status:', error.response?.status);
    console.log('Paychangu says:', JSON.stringify(error.response?.data, null, 2));
    console.log('Raw message:', error.message);
    throw error; // 👈 throw raw, don't use handleError for now
  }
}


  /**
   * Verify payment
   */
  async verifyPayment(tx_ref) {
    try {
      const response = await this.client.get(
        `/verify-payment/${encodeURIComponent(tx_ref)}`
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get Mobile Money Providers
   */
  async getMobileMoneyProviders() {
    try {
      const response = await this.client.get("/mobile-money");

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Initialize Direct Charge
   */
  async initializeBankTransfer(transferData) {
    try {
      const payload = {
        amount: transferData.amount,
        currency: "MWK",
        payment_method: transferData.payment_method,
        charge_id: transferData.charge_id,
        email: transferData.email,
        first_name: transferData.first_name,
        last_name: transferData.last_name,
        mobile: transferData.mobile,
      };

      const response = await this.client.post(
        "/direct-charge/payments/initialize",
        payload
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Health Check
   */
  async healthCheck() {
    try {
      const response = await this.client.get("/");

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Centralized error handler
   */
  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        data: error.response.data,
      };
    }

    return {
      status: 500,
      message: error.message,
    };
  }
}

module.exports = new PaychanguService();