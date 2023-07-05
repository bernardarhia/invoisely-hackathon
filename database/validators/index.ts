import * as owasp from "owasp-password-strength-test";

export class Validator {
  static validatePhone(number: string): boolean {
    const phoneRegex =
      /^(\+?\d{1,3}[- ]?)?\d{3,14}[- ]?\d{2,14}([- ]?\d{2,14})?([- ]?\d{2,14})?$/;
    return phoneRegex.test(number);
  }
  static isEmail({}, email: string): boolean {
    var tester =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email) return false;

    var emailParts = email.split("@");

    if (emailParts.length !== 2) return false;

    var account = emailParts[0];
    var address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    var domainParts = address.split(".");

    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    )
      return false;

    return tester.test(email);
  }
  static isPasswordStrong({}, password: string): [boolean, string] | boolean {
    owasp.config({
      allowPassphrases: true,
      maxLength: 20,
      minLength: 8,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4,
      maxConsecutiveChars: 3,
      userInputs: [
        "test",
        "example",
        "test@test.com",
        "example@example.com",
        "12345",
      ],
    });
    const result = owasp.test(password);
    if (result.errors.length > 0) {
      return [false, result.errors[0]];
    }
    return true;
  }
}
