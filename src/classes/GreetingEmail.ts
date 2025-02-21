/**
 * @GreetingEmail
 * This class handles the greetings email type.
 * It sends a greeting email to the user and logs the process.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */
import { EmailBaseMethods } from "../interfaces/IEmails";
import logging from "../config/logging";
import { generateRandomNumber } from "../utils/randomenizer";
import { determineTimeTimeOfDay } from "../utils/timeOfDay";
import { sendEmail } from "../utils/emailSender";
import { SentMessageInfo } from "nodemailer";

class GreetingEmail implements EmailBaseMethods {
    private name: string;
    private email: string;
    private tzClient: string;

    constructor(name: string, email: string, tzClient: string){
        this.name = name;
        this.email = email;
        this.tzClient = tzClient;
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
            `Hello ${this.name}, thank you for your message. I hope all is well on your end.`,
            `Hi ${this.name}, I appreciate your greetings. Looking forward to hearing more from you.`,
            `Greetings ${this.name}! Thank you for reaching out. I hope you're doing well`,
            `Hello ${this.name}, it's great to hear from you. Wishing you a pleasant ${determineTimeTimeOfDay(this.tzClient)}`,
            `Hi ${this.name}, thank you for gretting in touch. Feel free to let me know if there's anything I can help with.`
        ]

        // a response is extracted and returned...
        return answers[option];
    }

    // Method to send the message...
    async send(): Promise<void> {
        logging.info('Sending greeting message...');

        // randomly choose a message...
        const message = this.correctMessage();

        // the subject of the email...
        const subject: string = `Grateful for your Message, ${this.name} let's explore more together!`;

        // send email message through sendEmail function...
        try {
            const response: SentMessageInfo = await sendEmail(this.email, subject, message);
            // Log revelant information about the sent email...
            this.logsInfo(response);
        } catch (error: any) {
            // Log the error
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            logging.error('Error sending email:', error instanceof Error ? error.message : 'Unknown error');
            logging.error('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
            throw error; // Re-throw the error after logging
        }
    }
}

export { GreetingEmail };