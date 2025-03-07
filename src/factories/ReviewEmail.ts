/**
 * ReviewEmail class
 * @class ReviewEmail
 * @classdesc ReviewEmail class is used to send email to the user and the admmin when a review of an article is made.
 * @implements EmailBaseMethods
 *
 * @author Ricardo Medina
 * @date february 23, 2025
 * @version 1.0.0
 */
import logging from "../config/logging";
import { EmailBaseMethods } from "../interfaces/IEmails";
import { generateRandomNumber } from "../utils/randomenizer";
import { EmailService } from "src/utils/email/email.service";
import { SentMessageInfo } from "nodemailer";
import { generateHtmlTemplateForBlog } from "../utils/emailTemplates";
import { SERVER } from "../config/config";

class ReviewEmail implements EmailBaseMethods {
    private name: string;
    private email: string;
    private tzClient: string;
    private id_email: string;
    private article_title: string;
    private article_link: string;
    private article_image: string;

    constructor(
        private readonly emailService: EmailService,
        name: string,
        email: string,
        tzClient: string,
        id_email: string,
        article_title?: string,
        article_link?: string,
        article_image?: string,
    ){
        this.name = name;
        this.email = email;
        this.tzClient = tzClient;
        this.id_email = id_email;
        this.article_title = article_title || '';
        this.article_link = article_link || '';
        this.article_image = article_image || '';
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
            `Hello ${this.name}, thank you for your detailed review of the article "${this.article_title}". I truly appreciate the time and effort you put into it. I will review it thoroughly and get back to you soon to discuss it further. Your suggestions for topics are always welcome, and I look forward to collaborating with you.`,
            `Hi ${this.name}, I received your review of the article "${this.article_title}" and I am excited about the possibilities it presents. Thank you for your thoughtful input. I will be in touch shortly to discuss your ideas in more detail. Your contributions are invaluable, and I am eager to hear more from you.`,
            `Greetings ${this.name}! Thank you for submitting your review of the article "${this.article_title}". I am eager to delve into it and explore the potential it holds. I will reach out to you soon to discuss it further. Your ideas for new topics are always appreciated, and I look forward to our collaboration.`,
            `Hello ${this.name}, it's wonderful to receive your review of the article "${this.article_title}". I appreciate your initiative and the insights you've shared. I will review your review and contact you soon to discuss it in depth. Your suggestions for topics are always welcome, and I am excited to hear more from you.`,
            `Hi ${this.name}, thank you for your comprehensive review of the article "${this.article_title}". I am looking forward to discussing it with you soon. Your ideas for new topics are always welcome, and I will be in touch shortly to explore your suggestions further. Your input is highly valued, and I am excited about the potential collaboration.`
        ]

        // a response is extracted and returned...
        return answers[option];
    }

    // Html template for the review notification...
    private adminNotificationMessage(): string {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación de Reseña</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5ece5;">
            <div class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div class="header" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <h2>Notificación de Reseña</h2>
                </div>
                <div class="content" style="padding: 20px;">
                <p>El usuario <strong>${this.name}</strong> ha hecho una reseña.</p>
                <p>Detalles de la reseña:</p>
                <ul></ul>
                    <li><strong>Email del usuario:</strong> <a href="mailto:${this.email}" style="color: #52769a; text-decoration: none;">${this.email}</a></li>
                    <li><strong>Zona Horaria:</strong> ${this.tzClient}</li>
                    <li style="list-style: none; margin-top: 30px;">
                    <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin: 10px 0;">
                        <a href="${this.article_link}" style="text-decoration: none; color: inherit;">
                            <img src="${this.article_image}" alt="${this.article_title}" style="width: 100%; height: auto;">
                            <div style="padding: 10px; background-color: #f9f9f9;">
                                <h3 style="margin: 0; font-size: 18px;">${this.article_title}</h3>
                            </div>
                        </a>
                    </div>
                    </li>
                    <li style="list-style: none; margin-top: 30px;">
                    <div style="text-align: center; margin: 10px 0;">
                        <a href="${SERVER.WEB}/inbox/${this.id_email}" style="display: inline-block; padding: 10px 20px; background-color: #52769a; color: #ffffff; text-decoration: none; border-radius: 5px;">Ver Reseña</a>
                    </div>
                    </li>
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
        logging.info('Sending review message...');

        // randomly choose a message...
        const message = this.correctMessage();
        const reason = `You are receiving this email because you have reviewed the article ${this.article_title} on the Ricardo Dev blog.`;
        const htmlTemplate: string = generateHtmlTemplateForBlog(message, `${this.name} thank you for your review`, reason);
        // the subject of the email...
        const subject: string = `Thank you for your review, ${this.name}!`;

        // the subject of the email notification...
        const subjectNotification: string = `New Review from ${this.name}`;
        // generate the html template for the notification...
        const htmlTemplateNotification: string = this.adminNotificationMessage();

        // send email message through sendEmail function...
        try {
            const [userResponse, adminResponse]: SentMessageInfo[] = await Promise.all([
                this.emailService.sendEmail(this.email, subject, htmlTemplate),
                this.emailService.sendEmail(SERVER.EMAIL, subjectNotification, htmlTemplateNotification)
            ]);

            // Log relevant information about the sent emails...
            this.logsInfo(userResponse);
            this.logsInfo(adminResponse);
        } catch (error: any) {
            // Log the error
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            logging.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            throw error; // Re-throw the error after logging
        }
    }

}

export { ReviewEmail };