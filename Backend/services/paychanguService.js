/**
 * Paychangu Service - External payment API integration
 */

const axios = require("axios");

// ─── Hardcoded staff payout config ───────────────────────────────────────────
// Update BARBER_MOBILE to the barber's actual Airtel/TNM number
// Update OPERATOR_REF_ID if using TNM Mpamba instead of Airtel Money
const BARBER_MOBILE = process.env.BARBER_MOBILE || "0991234567";
const AIRTEL_MONEY_REF_ID = "20be6c20-adeb-4b5b-a7ba-0769820df4fb"; // Airtel Money Malawi
const TNM_MPAMBA_REF_ID   = "b0aef4b0-27b4-4a37-8ee0-e47f6898d8b9"; // TNM Mpamba Malawi
const OPERATOR_REF_ID = process.env.PAYOUT_OPERATOR === "tnm"
  ? TNM_MPAMBA_REF_ID
  : AIRTEL_MONEY_REF_ID;

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
   * Initiate payment (checkout)
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

      console.log("Sending payload:", JSON.stringify(payload, null, 2));
      console.log("Using key:", process.env.PAYCHANGU_SECRET_KEY ? "✅ Key exists" : "❌ Key is MISSING");

      const response = await this.client.post("/payment", payload);
      return response.data;
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Paychangu says:", JSON.stringify(error.response?.data, null, 2));
      console.log("Raw message:", error.message);
      throw error;
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
   * Initiate Mobile Money Payout to barber
   * Called automatically after a booking is confirmed.
   *
   * @param {object} payoutData
   * @param {number} payoutData.amount        - Amount in MWK
   * @param {string} payoutData.charge_id     - Unique payout reference (e.g. "PAYOUT_TX_REF")
   * @param {string} [payoutData.mobile]      - Override mobile (defaults to BARBER_MOBILE)
   * @param {string} [payoutData.operator_ref_id] - Override operator (defaults to OPERATOR_REF_ID)
   */
  async initiateMobilePayout(payoutData) {
    try {
      const payload = {
        mobile_money_operator_ref_id: payoutData.operator_ref_id || OPERATOR_REF_ID,
        mobile: payoutData.mobile || BARBER_MOBILE,
        amount: String(payoutData.amount),
        charge_id: payoutData.charge_id,
      };

      console.log("Initiating payout:", JSON.stringify(payload, null, 2));

      const response = await this.client.post("/mobile-money/payouts/initialize", payload);
      return response.data;
    } catch (error) {
      console.log("Payout status:", error.response?.status);
      console.log("Paychangu says:", JSON.stringify(error.response?.data, null, 2));
      throw error;
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