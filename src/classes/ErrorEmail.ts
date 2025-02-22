/**
 * @ErrorEmail
 * This class helps to handle the error emails type.
 * It sends an email to the user acknowledging the error report and logs the process.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */

/**
 * TODO:
 *  3. Hay que refacturar la funcion para enviar whats app.
 *  4. Hay que cambiar el mensaje que se envia por whats app.
 *  4. Hay que crear una funcion para enviar el correo de notificacion al admin.
 *  5. Crear funcion para guardar el log de error en la base de datos.
 */
import logging from "../config/logging";
import { EmailBaseMethods } from "../interfaces/IEmails";
import { SentMessageInfo } from "nodemailer";
import { sendEmail } from "../utils/emailSender";
import { sendWhatsAppMessage } from "../utils/whatsappSender";
import { SERVER } from "../config/config";
import { generateHtmlTemplate } from "../utils/emailTemplates";

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
    private logsInfo(response: SentMessageInfo): void {
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

    private adminNotificationMessage(): string {
        return `
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notificación de Reporte de Error</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
            <div class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #e1decf; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div class="header" style="text-align: center; padding: 10px 0; background-color: #6a6b36; color: #e1decf; border-radius: 8px 8px 0 0;">
                <h2>Notificación de Reporte de Error</h2>
                </div>
                <div class="content" style="padding: 20px;">
                <p>El usuario <strong>${this.name}</strong> ha enviado un nuevo reporte de error.</p>
                <p>Detalles del reporte:</p>
                <ul>
                    <li><strong>Email:</strong> <a href="mailto:${this.email}" style="color: #52769a; text-decoration: none;">${this.email}</a></li>
                    <li><strong>Zona Horaria:</strong> ${this.tz}</li>
                    <li><strong>Mensaje de Error:</strong> ${this.error_message}</li>
                    <li><strong>Link del Reporte:</strong> <a href="${SERVER.WEB}/inbox/${this.id_email}" style="color: #52769a; text-decoration: none;">Ver Reporte</a></li>
                </ul>
                </div>
                <div class="footer" style="text-align: center; padding: 10px 0; background-color: #6a6b36; color: #e1decf; border-radius: 0 0 8px 8px;">
                <p>&copy; ${new Date().getFullYear()} Tu Sitio Web</p>
                </div>
            </div>
            </body>
            </html>
        `;
    }

    private async wtsAppMessageError(): Promise<void> {
        const message = `Hola Ricardo, se ha detectado un nuevo mensaje de error a las ${this.serverTime()}.
                        \nPor favor, revísalo lo antes posible para asegurarte de que todo esté funcionando correctamente.
                        \nEste es el link del reporte: ${SERVER.WEB}/inbox${this.id_email}
                        \nEl usuario ${this.name}, con zona horaria ${this.tz}, fue quien generó el reporte.
                        \nEste es el mensaje de error: ${this.error_message}`;

        try {
            await sendWhatsAppMessage(SERVER.ADMIN_WHATSAPP_NUMBER, message);
            logging.info('WhatsApp message sent successfully');
        } catch (error: any) {
            logging.error('Error sending WhatsApp message: ' + error.message);
            throw error;
        }
    }

    async send(): Promise<void> {
        // log to let know that the process start...
        logging.info('Sending the message...');

        // Message to the user...
        const message: string = this.correctMessage();
        // HTML template for the email...
        const htmlTemplate: string = generateHtmlTemplate(message, 'Thank you for reporting the issue');

        // subject for the email repleying to the user...
        const subject: string = `Thank you for reporting the issue, ${this.name}.`;
        try {
            // email to thank the user for reporting the error...
            const response = await sendEmail(this.email, subject, htmlTemplate);

            // message sent to notify me about the error...
            await this.wtsAppMessageError();
            // log of the sent email...
            this.logsInfo(response);

            // Send email notification to the admin
            const adminMessage = this.adminNotificationMessage();
            const adminSubject = `New Error Report from ${this.name}`;
            const adminResponse = await sendEmail(SERVER.EMAIL, adminSubject, adminMessage);
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

export { ErrorEmail };