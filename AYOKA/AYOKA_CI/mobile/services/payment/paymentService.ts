export type PaymentMethod = 'mobile_money' | 'card' | 'cash';

export type PaymentProvider = 'orange_money' | 'mtn_money' | 'wave' | 'visa' | 'mastercard';

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  provider?: PaymentProvider;
  phoneNumber?: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export function validatePaymentRequest(request: PaymentRequest): { valid: boolean; error?: string } {
  if (request.amount <= 0) {
    return { valid: false, error: 'Le montant doit être supérieur à 0' };
  }

  if (request.method === 'mobile_money' && !request.phoneNumber) {
    return { valid: false, error: 'Numéro de téléphone requis pour Mobile Money' };
  }

  if (request.method === 'card' && !request.cardDetails) {
    return { valid: false, error: 'Détails de carte requis' };
  }

  if (request.method === 'card' && request.cardDetails) {
    const { number, expiry, cvv } = request.cardDetails;
    if (!number || !expiry || !cvv) {
      return { valid: false, error: 'Tous les détails de carte sont requis' };
    }
    if (number.length < 16) {
      return { valid: false, error: 'Numéro de carte invalide' };
    }
    if (cvv.length < 3) {
      return { valid: false, error: 'CVV invalide' };
    }
  }

  return { valid: true };
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('225')) {
    return cleaned;
  }
  return '225' + cleaned;
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('fr-FR');
}

export function getPaymentFees(amount: number, method: PaymentMethod): number {
  switch (method) {
    case 'mobile_money':
      return Math.max(100, amount * 0.01); // 1% minimum 100 FCFA
    case 'card':
      return Math.max(200, amount * 0.02); // 2% minimum 200 FCFA
    case 'cash':
      return 0;
    default:
      return 0;
  }
}

export function getTotalWithFees(amount: number, method: PaymentMethod): number {
  const fees = getPaymentFees(amount, method);
  return amount + fees;
}

// Mock payment processing (à remplacer par une vraie intégration)
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const validation = validatePaymentRequest(request);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Simuler le traitement du paiement
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simuler un succès (à remplacer par une vraie intégration)
  return {
    success: true,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  };
}
