import nodemailer from "nodemailer";

let transporter; // lazy singleton

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    // 🔍 VERIFY MAIL SERVER (TEMPORARY)
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Mail auth failed:", error.message);
      } else {
        console.log("✅ Mail server ready");
      }
    });
  }
  return transporter;
};

/* ------------------ SEND ENQUIRY EMAIL ------------------ */
export const sendEnquiryEmail = async ({ to, name, projectName, message }) => {
  console.log("📨 sendEnquiryEmail triggered for:", to);

  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08)">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5;padding:24px;text-align:center;color:#ffffff">
                <h1 style="margin:0;font-size:26px;letter-spacing:0.5px">RealtyEngage</h1>
                <p style="margin:6px 0 0;font-size:14px;opacity:0.9">
                  Property Enquiry Confirmation
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px">
                <h2 style="margin:0 0 16px;color:#111;font-size:20px">
                  Hello ${name}, 👋
                </h2>

                <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.6">
                  Thank you for contacting <strong>RealtyEngage</strong>.  
                  We have successfully received your enquiry and our team will review it shortly.
                </p>

                <!-- Info Box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:8px;margin:24px 0">
                  <tr>
                    <td style="padding:16px">
                      <p style="margin:0 0 8px;font-size:14px;color:#333">
                        <strong>Project Name</strong>
                      </p>
                      <p style="margin:0 0 16px;font-size:14px;color:#555">
                        ${projectName}
                      </p>

                      <p style="margin:0 0 8px;font-size:14px;color:#333">
                        <strong>Your Message</strong>
                      </p>
                      <p style="margin:0;font-size:14px;color:#555;line-height:1.5">
                        ${message || "—"}
                      </p>
                    </td>
                  </tr>
                </table>

                <p style="margin:0;color:#555;font-size:15px;line-height:1.6">
                  Our team will get back to you as soon as possible.
                </p>

                <p style="margin:32px 0 0;color:#333;font-size:15px">
                  Regards,<br/>
                  <strong>RealtyEngage Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f1f5f9;padding:16px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} RealtyEngage. All rights reserved.<br/>
                <span style="color:#999">This is an automated message. Please do not reply.</span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`;

  const info = await transporter.sendMail({
    from: `"RealtyEngage" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Your Enquiry Has Been Received ✔",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId)
};

export const sendSupportUserEmail = async ({
  to,
  name,
  ticketId,
  subject,
  message,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px;overflow:hidden">
            
            <tr>
              <td style="background:#22c55e;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">Support Ticket Created</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p style="font-size:15px;color:#333">Hi ${name}, 👋</p>

                <p style="font-size:14px;color:#555;line-height:1.6">
                  Your support request has been successfully created.  
                  Our team will contact you shortly.
                </p>

                <table width="100%" style="background:#f9fafb;border-radius:8px;margin:20px 0">
                  <tr>
                    <td style="padding:16px">
                      <p><strong>Ticket ID:</strong> ${ticketId}</p>
                      <p><strong>Subject:</strong> ${subject}</p>
                      <p><strong>Message:</strong></p>
                      <p style="color:#555">${message}</p>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px;color:#555">
                  Thank you for choosing <strong>RealtyEngage</strong>.
                </p>

                <p style="margin-top:24px">
                  Regards,<br/>
                  <strong>Support Team</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f1f5f9;padding:14px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} RealtyEngage
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"RealtyEngage Support" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Your Support Ticket Has Been Created 🎫",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};

export const sendSupportAdminEmail = async ({
  ticketId,
  name,
  email,
  subject,
  message,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#fff3f3;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px">
            
            <tr>
              <td style="background:#ef4444;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">🚨 New Support Ticket</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p><strong>Ticket ID:</strong> ${ticketId}</p>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>

                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:16px">
                  <p><strong>Message:</strong></p>
                  <p style="color:#555">${message}</p>
                </div>

                <p style="margin-top:24px;color:#555">
                  Please review and respond from admin dashboard.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"Support Alert" <${process.env.SENDER_EMAIL}>`,
    to: "itskiragaming45@gmail.com",
    subject: "🚨 New Support Ticket Received",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};

export const sendPaymentUserEmail = async ({
  to,
  name,
  projectName,
  plan,
  totalAmount,
  paidAmount,
  pendingAmount,
  status,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px;overflow:hidden">
            
            <tr>
              <td style="background:#2563eb;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">Payment Details</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p style="font-size:15px;color:#333">Hello ${name}, 👋</p>

                <p style="font-size:14px;color:#555;line-height:1.6">
                  Your payment has been successfully recorded for the following project.
                </p>

                <table width="100%" style="background:#f9fafb;border-radius:8px;margin:20px 0">
                  <tr>
                    <td style="padding:16px">
                      <p><strong>Project:</strong> ${projectName}</p>
                      <p><strong>Plan:</strong> ${plan}</p>
                      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
                      <p><strong>Paid Amount:</strong> ₹${paidAmount}</p>
                      <p><strong>Pending Amount:</strong> ₹${pendingAmount}</p>
                      <p><strong>Status:</strong> ${status.toUpperCase()}</p>
                    </td>
                  </tr>
                </table>

                <p style="font-size:14px;color:#555">
                  You can continue your remaining payments from your dashboard.
                </p>

                <p style="margin-top:24px">
                  Regards,<br/>
                  <strong>RealtyEngage Accounts Team</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f1f5f9;padding:14px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} RealtyEngage
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"RealtyEngage Accounts" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Payment Recorded Successfully 💳",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};

export const sendPaymentAdminEmail = async ({
  customerName,
  customerEmail,
  projectName,
  plan,
  totalAmount,
  paidAmount,
  pendingAmount,
  status,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#fff7ed;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px">
            
            <tr>
              <td style="background:#f97316;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">💰 New Payment Update</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Project:</strong> ${projectName}</p>
                <p><strong>Plan:</strong> ${plan}</p>

                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:16px">
                  <p><strong>Total:</strong> ₹${totalAmount}</p>
                  <p><strong>Paid:</strong> ₹${paidAmount}</p>
                  <p><strong>Pending:</strong> ₹${pendingAmount}</p>
                  <p><strong>Status:</strong> ${status.toUpperCase()}</p>
                </div>

                <p style="margin-top:20px;color:#555">
                  Please review payment details in admin dashboard.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"Payment Alert" <${process.env.SENDER_EMAIL}>`,
    to: "itskiragaming45@gmail.com",
    subject: "💰 New Payment Recorded",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};

export const sendMonthlyPaymentUserEmail = async ({
  to,
  name,
  projectName,
  paidNow,
  totalPaid,
  pendingAmount,
  month,
  status,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px;overflow:hidden">
            
            <tr>
              <td style="background:#16a34a;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">Monthly Payment Received</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p>Hello ${name}, 👋</p>

                <p style="color:#555">
                  We have received your monthly payment successfully.
                </p>

                <table width="100%" style="background:#f9fafb;border-radius:8px;margin:20px 0">
                  <tr>
                    <td style="padding:16px">
                      <p><strong>Project:</strong> ${projectName}</p>
                      <p><strong>Paid This Month:</strong> ₹${paidNow}</p>
                      <p><strong>Total Paid:</strong> ₹${totalPaid}</p>
                      <p><strong>Pending Amount:</strong> ₹${pendingAmount}</p>
                      <p><strong>Month:</strong> ${month}</p>
                      <p><strong>Status:</strong> ${status.toUpperCase()}</p>
                    </td>
                  </tr>
                </table>

                <p style="color:#555">
                  Thank you for your payment.
                </p>

                <p style="margin-top:24px">
                  Regards,<br/>
                  <strong>RealtyEngage Accounts Team</strong>
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f1f5f9;padding:14px;text-align:center;font-size:12px;color:#777">
                © ${new Date().getFullYear()} RealtyEngage
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"RealtyEngage Accounts" <${process.env.SENDER_EMAIL}>`,
    to,
    subject: "Monthly Payment Received ✔",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};

export const sendMonthlyPaymentAdminEmail = async ({
  customerName,
  customerEmail,
  projectName,
  paidNow,
  totalPaid,
  pendingAmount,
  month,
  status,
}) => {
  const transporter = getTransporter();

  const htmlTemplate = `
  <div style="background:#fff7ed;padding:40px 0;font-family:Arial,Helvetica,sans-serif">
    <table width="100%" align="center">
      <tr>
        <td align="center">
          <table width="600" style="background:#ffffff;border-radius:10px">
            
            <tr>
              <td style="background:#f97316;padding:22px;color:#fff;text-align:center">
                <h2 style="margin:0">📩 Monthly Payment Update</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:32px">
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Email:</strong> ${customerEmail}</p>
                <p><strong>Project:</strong> ${projectName}</p>

                <div style="background:#f9fafb;padding:16px;border-radius:8px;margin-top:16px">
                  <p><strong>Paid Now:</strong> ₹${paidNow}</p>
                  <p><strong>Total Paid:</strong> ₹${totalPaid}</p>
                  <p><strong>Pending:</strong> ₹${pendingAmount}</p>
                  <p><strong>Month:</strong> ${month}</p>
                  <p><strong>Status:</strong> ${status.toUpperCase()}</p>
                </div>

                <p style="margin-top:20px;color:#555">
                  Please verify payment in admin dashboard.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;

  const info = await transporter.sendMail({
    from: `"Payment Alert" <${process.env.SENDER_EMAIL}>`,
    to: "itskiragaming45@gmail.com",
    subject: "📩 Monthly Payment Received",
    html: htmlTemplate,
  });
  console.log("📨 Mail SENT, messageId:", info.messageId);
};
