/**
 * @class ProposalEmail
 * @classdesc Class representing a proposal email.
 * This class extends the Email class and implements the EmailBaseMethods interface.
 * It sends a proposal email to the user and logs the process.
 *
 * @author Ricardo Medina
 * @date 22 de febrero de 2025
 */

import logging from "../config/logging";
import { EmailBaseMethods } from "../interfaces/IEmails";
import { generateRandomNumber } from "../utils/randomenizer";
import { EmailService } from "src/utils/email/email.service";
import { SentMessageInfo } from "nodemailer";
import { generateHtmlTemplateForBlog } from "../utils/emailTemplates";
import { SERVER } from "../config/config";

class ProposalEmail implements EmailBaseMethods {
    private name: string;
    private email: string;
    private tzClient: string;
    private id_email: string;

    constructor(
        name: string,
        email: string,
        tzClient: string,
        id_email: string,
        private readonly emailService: EmailService
    ){
        this.name = name;
        this.email = email;
        this.tzClient = tzClient;
        this.id_email = id_email;
    }

    private logsInfo(response: SentMessageInfo): void{
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
        logging.info('Email sent successfully.');
        logging.info(`Message ID: ${response.messageId}`);
        logging.info(`Accepted addresses: ${response.accepted.join(', ')}`);
        logging.info(`Rejected addresses: ${response.rejected.join(', ')}`);
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    }

    private correctMessage(): string {
        // a randome number is generated between 0 - 4...
        const option: number = generateRandomNumber(0, 4);

        // this array contains several answers...
        const answers: string[] = [
            `Hello ${this.name}, thank you for your detailed proposal. I truly appreciate the time and effort you put into it. I will review it thoroughly and get back to you soon to discuss it further. Your suggestions for topics are always welcome, and I look forward to collaborating with you.`,
            `Hi ${this.name}, I received your proposal and I am excited about the possibilities it presents. Thank you for your thoughtful input. I will be in touch shortly to discuss your ideas in more detail. Your contributions are invaluable, and I am eager to hear more from you.`,
            `Greetings ${this.name}! Thank you for submitting your proposal. I am eager to delve into it and explore the potential it holds. I will reach out to you soon to discuss it further. Your ideas for new topics are always appreciated, and I look forward to our collaboration.`,
            `Hello ${this.name}, it's wonderful to receive your proposal. I appreciate your initiative and the insights you've shared. I will review your proposal and contact you soon to discuss it in depth. Your suggestions for topics are always welcome, and I am excited to hear more from you.`,
            `Hi ${this.name}, thank you for your comprehensive proposal. I am looking forward to discussing it with you soon. Your ideas for new topics are always welcome, and I will be in touch shortly to explore your suggestions further. Your input is highly valued, and I am excited about the potential collaboration.`
        ]

        // a response is extracted and returned...
        return answers[option];
    }

    // Html template for the proposal notification...
    private adminNotificationMessage(): string {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Notificación de Propuesta</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5ece5;">
                <div class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 8px 8px 0 0;">
                        <h2>Notificación de Propuesta</h2>
                    </div>
                    <div class="content" style="padding: 20px;">
                        <p>El usuario <strong>${this.name}</strong> ha enviado una nueva propuesta.</p>
                        <p>Detalles de la propuesta:</p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:${this.email}" style="color: #52769a; text-decoration: none;">${this.email}</a></li>
                            <li><strong>Zona Horaria:</strong> ${this.tzClient}</li>
                            <li><strong>Link:</strong> <a href="${SERVER.WEB}/inbox/${this.id_email}" style="color: #52769a; text-decoration: none;">Ver Propuesta</a></li>
                        </ul>
                    </div>
                    <div class="footer" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 0 0 8px 8px;">
                        <p>&copy; ${new Date().getFullYear()} Ricardo Dev</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Method to send the message...
    async send(): Promise<void> {
        logging.info('Sending proposal message...');

        // randomly choose a message...
        const message = this.correctMessage();
        // This is the reason message that helps to identify the type of email...
        const reason = 'You are recieving this email because you have sent a proposal to Richard Dev.';
        // generate the html template...
        const htmlTemplate: string = generateHtmlTemplateForBlog(message, 'Thank you for your proposal', reason);
        // generate the subject of the email...
        const subject: string = `Thank you for your proposal, ${this.name}!`;

        // the subject of the email notification...
        const subjectNotification: string = `New Proposal from ${this.name}`;
        // generate the html template for the notification...
        const htmlTemplateNotification: string = this.adminNotificationMessage();


        // Send email message through sendEmail function...
        try {
            // send the emails concurrently using Promise.all...
            const [userResponse, adminResponse] = await Promise.all([
                this.emailService.sendEmail(this.email, subject, htmlTemplate),
                this.emailService.sendEmail(SERVER.EMAIL, subjectNotification, htmlTemplateNotification)
            ]);

            // log the process for both emails...
            this.logsInfo(userResponse);
            this.logsInfo(adminResponse);
        } catch(error: any){
            // Log the error
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            logging.error('Error sending proposal email.');
            logging.error(error);
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            throw error; // Re-throw the error after logging
        }
    }
}

export { ProposalEmail };