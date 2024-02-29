const createMailTransporter = require('./createMailTransporter');

const sendVerificationMail = async (email, token) => {
  const transporter = createMailTransporter();
  const mailOptions = {
    from: `TaskFlow - Task Management App <${process.env.EMAIL}>`,
    to: email,
    secure: true,
    subject: "Account Verification",
    html: `<p>Click <a href="http://localhost:5173/verify-email?emailToken=${token}"> click here</a> to verify your account</p>`,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err.message);
  }
}

module.exports = sendVerificationMail;