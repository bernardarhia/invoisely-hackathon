import PayStack from "../../paystack/dist";

export const paystack = new PayStack();
export type ChargeDataStatus =
  | "pay_offline"
  | "send_pin"
  | "send_address"
  | "send_otp"
  | "send_address"
  | "send_birthday";
