import { paystack } from ".";
import { assert } from "../../helpers/asserts";
import { getNetworkBaseOnNumber } from "../../utils";
export async function payWithMobileMoney(data: {
  phone: string;
  amount: number;
  email: string;
  accountName?: string;
}) {
  const { amount, email, phone, accountName } = data;
  const telecomType = getNetworkBaseOnNumber(phone);
  assert(telecomType, "Invalid phone number provided");

  // verify user account details
  const numberVerified = await paystack.verifyNumber({
    account_number: phone,
    bank_code: telecomType,
  });
  if (accountName) {
    assert(
      accountName.toLowerCase() ===
        numberVerified.data.account_name.toLowerCase(),
      "Invalid account name provided",
    );
  }

  // send charge request to client phone
  const charge = await paystack.charges.chargeWithMobileMoney({
    email,
    amount,
    mobile_money: {
      phone,
      provider: telecomType,
    },
  });
  return charge;
}
