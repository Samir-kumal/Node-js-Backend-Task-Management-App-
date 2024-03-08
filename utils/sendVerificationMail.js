const createMailTransporter = require("./createMailTransporter");

const sendVerificationMail = async (email, token) => {
  const transporter = createMailTransporter();
  if(email && token){
    const mailOptions = {
      from: `TaskFlow - Task Management App <${process.env.EMAIL}>`,
      to: email,
      subject: "Account Verification",
      html: `<p>Click <a href="https://taskflow-tms.vercel.app//verify-email?emailToken=${token}"> click here</a> to verify your account</p>`,
    };
    try {
    console.log("email verification Started....");
  
      await transporter.sendMail(mailOptions);
      console.log("email verification Completed....");
    } catch (err) {
      console.log(err.message);
    }
  }
};

module.exports = sendVerificationMail;
