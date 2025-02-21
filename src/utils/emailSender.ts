/**
 * @module EmailSender
 * This module provides a utility function to send emails using nodemailer.
 * It uses the server configuration from the environment variables.
 *
 * Author: Ricardo Medina
 * Date: 20 de febrero de 2025
 */

import nodemailer, { SentMessageInfo, TransportOptions } from 'nodemailer';
import logging from '../config/logging';
import { SERVER } from '../config/config';
import { MailOptions } from '../interfaces/IEmails';

/**
 * Sends an email using the nodemailer library.
 *
 * @param recipient - The email address of the recipient.
 * @param subject - The subject of the email.
 * @param message - The HTML content of the email.
 * @returns A promise that resolves to the information about the sent message.
 */
const sendEmail = async (recipient: string, subject: string, message: string): Promise<SentMessageInfo> => {
    try {
        const transport = nodemailer.createTransport({
            host: SERVER.EHOST,
            port: SERVER.EPORT,
            secure: true,
            auth: {
                user: SERVER.EUSER,
                pass: SERVER.EPASS
            },
        } as TransportOptions);

        // Email's body...
        const mailOptions: MailOptions = {
            from: SERVER.EUSER,
            to: recipient,
            subject: subject,
            html: message
        };

        // Send the email...
        const response: SentMessageInfo = await transport.sendMail(mailOptions);
        logging.info(`Email sent to ${recipient}`);
        return response;
    } catch (error: any) {
        logging.error(`Error sending email: ${error}`);
        throw new Error('Error sending email');
    }
}

export { sendEmail };