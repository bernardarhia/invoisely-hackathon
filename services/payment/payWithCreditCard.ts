import { paystack } from ".";

interface CreditCardPayload {
  card: {
    number: string;
    cvv: string;
    expiry_year: string;
    expiry_month: string;
  };
  amount: number;
  email: string;
}
export const payWithCreditCard = async (payload: CreditCardPayload) => {
  const charge = await paystack.charges.chargeWithCard(payload);
  return charge;
};
