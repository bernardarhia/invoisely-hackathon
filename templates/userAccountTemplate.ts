const { EMAIL_SENDER, MAIN_ORIGIN, APP_NAME } = process.env;

const defaultFrom = (from: string) => `${APP_NAME} ${EMAIL_SENDER || from}`;
export const newUserEmailTemplate = (
  email: string,
  accountVerificationToken: string,
  from?: string,
) => ({
  from: defaultFrom(from),
  to: email,
  subject: `${email}, Welcome to the our website`,
  text: "Welcome to the our website",
  html: `
      <h1>Welcome to our website!</h1>
      <p>We're glad you've decided to join us. We hope you find everything you're looking for here and enjoy using our site.</p>
      <p>If you have any questions or need any help, please don't hesitate to contact us. Thank you for signing up!</p>
      <p>${accountVerificationToken} is your new verification code</p>
    `,
});

export const newUserCreatedTemplate = (
  email: string,
  data: { fullName?: string; email?: string; password?: string },
  from?: string,
) => ({
  from: defaultFrom(from),
  to: email,
  subject: "Account created",
  html: `
  <h5>Hey ${data.fullName}</h5>
  <P>An account has been created for you on<a href='${MAIN_ORIGIN}'>${APP_NAME}</a> .</p>
  <p>Email: ${data.email}</p>
  <p>Password: ${data.password}</p>
  <p>click on the <a href='${MAIN_ORIGIN}'>Link</a> to login</p>
  <p>For security reasons, we <b>highly</b> suggest you change your password once you login</p>
  `,
});
