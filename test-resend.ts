import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

// Get API key from env or error
const resendKey = process.env.RESEND_API_KEY;
if (!resendKey) {
  console.error("No RESEND_API_KEY");
  process.exit(1);
}

const resend = new Resend(resendKey);

async function testResend() {
  const base64Data = Buffer.from('Hello world from PDF').toString('base64');
  
  console.log("Sending email with Buffer:");
  const res1 = await resend.emails.send({
    from: "Mini Style Cards <info@ministylecards.com>",
    to: "info@ministylecards.com", // Send to self
    subject: "Resend Test - Buffer",
    html: "<p>Test Buffer</p>",
    attachments: [{
      filename: 'test1.pdf',
      content: Buffer.from(base64Data, 'base64'),
    }]
  });
  console.log("Buffer response:", res1);

  console.log("Sending email with Base64 string:");
  const res2 = await resend.emails.send({
    from: "Mini Style Cards <info@ministylecards.com>",
    to: "info@ministylecards.com",
    subject: "Resend Test - String",
    html: "<p>Test String</p>",
    attachments: [{
      filename: 'test2.pdf',
      content: base64Data,
    }]
  });
  console.log("String response:", res2);
}

testResend();
