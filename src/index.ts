import "module-alias/register"
/** import all configs effectively validates there are no errors */
import "@/app/config"

import { Server } from "@/core/server"
import { logger } from "./core/server/logger"
import puppeteer from "puppeteer"
import { Resend } from "resend"
import { emailConfig } from "@/app/config"
import { EmailService } from "./core/email"
import { ResendEmailService } from "./core/helpers/email"
import { DocumentGeneratorService } from "./core/helpers/genratePDForPNG"
// import { db } from "./core/database"

async function main(): Promise<void> {
//   const resend = new Resend(process.env.RESEND_EMAIL_API_KEY)


// const recipients = ["hassanososoftware@gmail.com"] // Replace with actual recipient emails
// const subject = "Test Email"
// const emailHtml = "<h1>Hello, this is a test email!</h1>"
// const htmlContent = "<h1>Hello, this is a test email!</h1>"
// ResendEmailService.send(recipients, subject, emailHtml)
// DocumentGeneratorService.generate(htmlContent, "pdf");

     




  // Function to generate HTML content
  // async function sendEmail(recipients: string[], subject: string, htmlContent: string) {
  //     if (!recipients.length) {
  //       console.error("No recipients provided.");
  //       return;
  //     }

  //     try {
  //       const responses = await Promise.all(
  //         recipients.map(async (recipient) => {
  //           return await resend.emails.send({
  //             from: "OSO Developers <no-reply@transactional.oso.nyc>",
  //             to: recipient,
  //             subject,
  //             html: htmlContent,
  //           });
  //         })
  //       );

  //       console.log("Emails sent successfully:", responses);
  //     } catch (error) {
  //       console.error("Error sending emails:", error);
  //     }
  //   }

  //   // Example Usage
  //   const emailHtml = `
  //   <html>
  //     <body>
  //       <h1>Hello!</h1>
  //       <p>Welcome to our service. This is a test email.</p>
  //     </body>
  //   </html>`;

  //   const recipientsList = ["hassanososoftware@gmail.com"];
  //   sendEmail(recipientsList, "Welcome Email", emailHtml);
  //   async function GenerateDocument(htmlContent: string, type: string) {
  //     if (!['pdf', 'png'].includes(type)) {
  //         console.error('Invalid type. Please use "pdf" or "png".');
  //         return;
  //     }

  //     const browser = await puppeteer.launch();
  //     const page = await browser.newPage();

  //     await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  //     if (type === 'pdf') {
  //         await page.pdf({ path: 'output.pdf', format: 'A4' });
  //         console.log('PDF generated: output.pdf');
  //     } else if (type === 'png') {
  //         await page.screenshot({ path: 'output.png', fullPage: true });
  //         console.log('PNG generated: output.png');
  //     }

  //     await browser.close();
  // }

  // // Example Usage
  // const htmlContent = `
  // <!DOCTYPE html>
  // <html lang="en">
  // <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <title>Sample Page</title>
  //     <style>
  //         body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
  //         h1 { color: blue; }
  //     </style>
  // </head>
  // <body>
  //     <h1>Hello, World!</h1>
  //     <p>This is a sample HTML page.</p>
  // </body>
  // </html>`;

  // // Generate PDF
  // GenerateDocument(htmlContent, 'pdf');

  // const user =await db.user.deleteMany()
  const server = Server.new()
  await Server.start(server)
}

main().catch((err) => logger.error(err))
