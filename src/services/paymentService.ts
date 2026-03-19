/**
 * Payment Service - API calls for Paychangu payments
 */

const PAYCHANGU_BASE_URL = 'https://kfades.onrender.com/paychangu';

export interface PaymentInitData {
  amount: number;
  tx_ref: string;
  first_name: string;
  last_name: string;
  email: string;
  callback_url?: string;
  return_url?: string;
}

export interface BankTransferData {
  amount: number;
  payment_method: string;
  charge_id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
}

export interface PaymentApiResponse {
  error: boolean;
  message?: string;
  data?: any;
}

const paymentService = {
  /**
   * Health check for Paychangu API
   * @returns Promise with API status
   */
  async healthCheck(): Promise<PaymentApiResponse> {
    try {
      const response = await fetch(`${PAYCHANGU_BASE_URL}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking payment API:', error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Error checking payment API',
      };
    }
  },

  /**
   * Initiate a payment transaction
   * @param paymentData - Payment details
   * @returns Promise with payment response
   */
  async initiateTransaction(paymentData: PaymentInitData): Promise<PaymentApiResponse> {
    try {
      const response = await fetch(`${PAYCHANGU_BASE_URL}/initiate-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error initiating transaction:', error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Error initiating transaction',
      };
    }
  },

  /**
   * Verify a payment transaction
   * @param tx_ref - Transaction reference
   * @returns Promise with verification result
   */
  async verifyPayment(tx_ref: string): Promise<PaymentApiResponse> {
    try {
      const response = await fetch(`${PAYCHANGU_BASE_URL}/verify-payment/${encodeURIComponent(tx_ref)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Error verifying payment',
      };
    }
  },

  /**
   * Get available mobile money providers
   * @returns Promise with mobile money providers
   */
  async getMobileMoneyProviders(): Promise<PaymentApiResponse> {
    try {
      const response = await fetch(`${PAYCHANGU_BASE_URL}/mobile-money`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching mobile money providers:', error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Error fetching mobile money providers',
      };
    }
  },

  /**
   * Initialize bank transfer / direct charge
   * @param transferData - Transfer details
   * @returns Promise with transfer response
   */
  async initializeBankTransfer(transferData: BankTransferData): Promise<PaymentApiResponse> {
    try {
      const response = await fetch(`${PAYCHANGU_BASE_URL}/bank-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error initializing bank transfer:', error);
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Error initializing bank transfer',
      };
    }
  },
};

export default paymentService;

