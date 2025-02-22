/**
 * @WorkEmail
 * This class handles the work email type.
 * It sends a work-related email to the user and logs the process.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */
import logging from "../config/logging";
import { EmailBaseMethods } from "../interfaces/IEmails";
import { generateRandomNumber } from "../utils/randomenizer";
import { sendEmail } from "../utils/emailSender";
import { determineTimeTimeOfDay } from "../utils/timeOfDay";
import { SERVER } from "../config/config";
import { SentMessageInfo } from "nodemailer";
import { generateHtmlTemplate } from "src/utils/emailTemplates";

class WorkEmail implements EmailBaseMethods {
    private name: string;
    private email: string;
    private tz: string;
    private id_email: string;

    constructor(name: string, email: string, tz: string, id_email: string) {
        this.name = name;
        this.email = email;
        this.tz = tz;
        this.id_email = id_email;
    }

    // Function to handle the info log...
    private logsInfo(response: SentMessageInfo): void {
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
        logging.info('Email sent successfully.');
        logging.info(`Message ID: ${response.messageId}`);
        logging.info(`Accepted addresses: ${response.accepted.join(', ')}`);
        logging.info(`Rejected addresses: ${response.rejected.join(', ')}`);
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    }

    private correctMessage(): string {
        // Generate a random number between 0 - 5...
        const option: number = generateRandomNumber(0, 5);

        // This array contains the answers...
        const answers: string[] = [
            `Hi ${this.name}, thank you so much for considering me for your project. I'm confident that my skills and experience can contribute to making it a success. I’ll get back to you as soon as possible!`,
            `Hello ${this.name}, I greatly appreciate your message and your interest in working together. I’m excited about the opportunity and I’m confident that I can help achieve great results. I'll be in touch soon!`,
            `Hi ${this.name}, thanks for reaching out! Your proposal sounds interesting, and I’m eager to explore how we can work together to make your project successful. I’ll respond shortly with more details.`,
            `Hello ${this.name}, I’m thrilled by the opportunity you've presented. I truly believe I can add value to your project or team and am excited to discuss further. I'll reply soon with more information.`,
            `Hi ${this.name}, I appreciate your interest in my services! I’m confident I can be the right fit to help your project succeed. I’ll be reviewing your message and will respond shortly.`,
            `Good ${determineTimeTimeOfDay(this.tz)}, ${this.name}! Thank you for considering me for this opportunity. I'm excited to explore how I can help make your project a success. I'll get back to you shortly!`
        ];

        return answers[option];
    }

    // This email html template is for me, to let me know that I have a possible job offer...
    private messageForMe(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Oferta Laboral</title>
            <style>
            body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            }
            .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #e1decf;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
            text-align: center;
            padding: 10px 0;
            background-color: #6a6b36;
            color: #e1decf;
            border-radius: 8px 8px 0 0;
            }
            .content {
            padding: 20px;
            }
            .footer {
            text-align: center;
            padding: 10px 0;
            background-color: #6a6b36;
            color: #e1decf;
            border-radius: 0 0 8px 8px;
            }
            a {
            color: #52769a;
            text-decoration: none;
            }
            .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #fbf8ea;
            background-color: #52769a;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            }
            </style>
            </head>
            <body>
                <div class="container"></div>
                    <div class="header">
                        <h2>${this.name} está interesado en colaborar contigo.</h2>
                    </div>
                    <div class="content">
                        <p>
                            Hay una oferta laboral que deberías revisar lo antes posible, ${this.name} tiene algo
                            interesante entre manos, ponte en contacto lo antes posible.
                        </p>
                        <p>
                            <strong>Correo:</strong> <a href="mailto:${this.email}">${this.email}</a><br>
                            <a href="${SERVER.WEB}/inbox/${this.id_email}" class="button">Ver Propuesta Laboral</a>
                        </p>
                    </div>
                    <div class="footer">
                        <h3>¡Te deseo mucho éxito!</h3>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    async send(): Promise<void> {
        logging.info('Sending the message...');

        // This is a message to the prospective customer
        const message: string = this.correctMessage();
        // Send the title and the message to the generateHtmlTemplate function...
        const htmlTemplate: string = generateHtmlTemplate(message, 'Thank you for contacting me!');

        // And this is a message to me, to let me know that I have a possible job offer...
        const messageForMe: string = this.messageForMe();

        // This is the subject for the customer message...
        const subjectC: string = `Thank you for reaching out, ${this.name}! I'm excited to discuss your project.`;
        // And this is the subject of the email that notifies me...
        const subjectM: string = `Nueva consulta de trabajo de ${this.name}: Oportunidad de colaboración potencial`;

        try {
            const [response1, response2]: SentMessageInfo[] = await Promise.all([
                sendEmail(this.email, subjectC, htmlTemplate),
                sendEmail(SERVER.EMAILW, subjectM, messageForMe)
            ]);

            // Log of the response one (customer)
            this.logsInfo(response1);
            // Log of the response two (Email to me)
            this.logsInfo(response2);
        } catch (error: any) {
            // Log the error
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            logging.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            throw error; // Re-throw the error after logging
        }
    }
}

export { WorkEmail };