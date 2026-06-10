import { Resend } from 'resend';
import 'dotenv/config';

(async () => {
    try {
        const resendKey = process.env.RESEND_API_KEY;
        const resend = new Resend(resendKey);

        const emailRes = await resend.emails.send({
            from: "Mini Style Cards <info@ministylecards.com>",
            to: ["happyapplelee@gmail.com"], // the user
            subject: "test attachment",
            html: "test html with attachment",
            attachments: [
                {
                    filename: 'test.txt',
                    content: Buffer.from('hello world').toString('base64'),
                    contentType: 'text/plain'
                }
            ]
        });
        
        console.log(emailRes);
    } catch (e) {
        console.error(e);
    }
})();

