import * as nodemailer from 'nodemailer';
export async function sendTemporaryPasswordEmail(
  email: string,
  tempPassword: string,
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pos.project67@gmail.com',
      pass: 'igyk qdtl ymug ltkc',
    },
  });
  const mailOptions = {
    from: 'pos.project67@gmail.com',
    to: 'pos.project67@gmail.com',
    subject: 'Your Temporary Password',
    text: `Your email ${email}temporary password is: ${tempPassword}. Please use this password to login and reset your password.`,
  };
  await transporter.sendMail(mailOptions);
}
