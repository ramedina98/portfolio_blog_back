/**
 * @ErrorEmail
 * This class helps to handle the error emails type.
 * It sends an email to the user acknowledging the error report and logs the process.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */

import { EmailBaseMethods } from "../interfaces/IEmails";
import { SentMessageInfo } from "nodemailer";
import { sendEmail } from "../utils/emailSender";
// TODO: hay que acomodar esto bien --> import { sendWhatsAppMessage } from "../utils/whatsappSender";
import logging from "../config/logging";
import { SERVER } from "../config/config";

class ErrorEmail implements EmailBaseMethods {
    private name: string;
    private email: string;
    private tz: string;
    private id_email: string;
    private error_message: string;

    constructor(name: string, email: string, tz: string, id_email: string, error_message: string) {
        this.name = name;
        this.email = email;
        this.tz = tz;
        this.id_email = id_email;
        this.error_message = error_message;
    }

    // function to handle the info log...
    private logsInfo(response: SentMessageInfo): void{
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
        logging.info('Email sent successfully.');
        logging.info(`Message ID: ${response.messageId}`);
        logging.info(`Accepted addresses: ${response.accepted.join(', ')}`);
        logging.info(`Rejected addresses: ${response.rejected.join(', ')}`);
        logging.info('::::::::::::::::::::::::::::::::::::::::::::::::::::::::::');
    }

    // Function to manage the server time...
    private serverTime(): string {
        const now = new Date();
        let hours: number = now.getHours();
        const minutes: number = now.getMinutes();
        const seconds: number = now.getSeconds();
        const ampm: string = hours >= 12 ? 'PM' : 'AM';

        // Turn the 24 hour format into a 12 hour format...
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 in 12 hour format has to be 12...

        // format minutes and second to always have two digites...
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;

        return `${hours}:${minutesFormatted}:${secondsFormatted} ${ampm}`;
    }

    private correctMessage(): string {
        return `Hello ${this.name}, thank you for reporting the issue. I appreciate your feedback and will work to resolve the problem as soon as possible.`;
    }

    /**
     * private async wtsAppMessageError(): Promise<void>{
        const message = `Hola Ricardo, se ha detectado un nuevo mensaje de error a las ${this.serverTime()}.
                        \nPor favor, revísalo lo antes posible para asegurarte de que todo esté funcionando correctamente.
                        \nEste es el link del reporte: ${SERVER.WEB}/inbox${this.id_email}
                        \nEl usuario ${this.name}, con zona horaria ${this.tz}, fue quien genero el reporte.
                        \nEste es el mensaje de error: ${this.error_message}`;

        try {
            await sendWhatsAppMessage(SERVER.NUMBER, message);
            logging.info('Whats App successfully sent');
        } catch (error: any) {
            logging.error('There was an error while sending the Whats app message: ' + error.message)
            throw error;
        }
    } */

    async send(): Promise<void> {
        // log to let know that the process start...
        logging.info('Sending the message...');

        // Message to the user...
        const message: string = this.correctMessage();
        // subject for the email repleying to the user...
        const subject: string = `Thank you for reporting the issue, ${this.name}.`;
        try {
            // email to thank the user for reporting the error...
            const response = await sendEmail(this.email, subject, message);

            // message sent to notify me about the error...
            // NOTE: volver a usar esto --> await this.wtsAppMessageError();
            // log of the sent email...
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

export { ErrorEmail };