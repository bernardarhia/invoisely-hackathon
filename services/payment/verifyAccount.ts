import { ChargeDataStatus, paystack } from ".";

interface VerificationData {
  reference: string;
  code?: string;
  birthday?: Date;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  verificationType: ChargeDataStatus;
}
export const verifyPaymentAccount = async (data: VerificationData) => {
  const chargesApi = paystack.charges;
  const { reference = "", code = "", birthday, address = "", state = "", zipcode = "", city = "", verificationType } = data;
  let response: any;

  switch (verificationType) {
    case "send_otp":
      response = await chargesApi.submitOTP({
        otp: code,
        reference: reference,
      });
      break;
    case "send_pin":
      response = await chargesApi.submitPin({
        pin: code,
        reference: reference,
      });
      break;
    case "send_birthday":
      response = await chargesApi.submitBirthday({ birthday: birthday, reference: reference })
      break;
    case "send_address":
      response = await chargesApi.submitAddress({
        address,
        city,
        state,
        zipcode, reference: reference
      })
      break;
  }

  return response;
};
