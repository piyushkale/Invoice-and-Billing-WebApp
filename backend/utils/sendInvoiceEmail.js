const nodemailer = require("nodemailer");

const sendInvoiceEmail = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject: "Invoice",
    html: `
      <h2>Your Invoice is Ready</h2>
      <p>Click below to view your invoice:</p>
      <a href="${link}">View Invoice 👆</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendInvoiceEmail };
