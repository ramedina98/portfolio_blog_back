/**
 * @module Emails
 * This module defines various interfaces and enumerations related to email handling in the application.
 * It includes:
 * - EmailType: An enumeration of different types of emails.
 * - Emails: An interface representing the structure of an email object.
 * - EmailBaseMethods: An interface defining the basic methods that an email class should implement.
 * - IEFactory: An interface representing the options required to create different types of emails.
 * - MailOptions: An interface representing the options for sending an email.
 * - INotificationTitle: An interface for typing the notificationTitle function.
 *
 * @update: Ricardo Medina
 * Date: 23 de febrero de 2025
 */

enum EmailType {
    Work = 'work',
    Opinion = 'opinion',
    Greetings = 'greetings',
    ErrorReport = 'error_report',
    Response = 'response'
}

interface Emails {
    id_email: string;
    email_sender: string;
    name_sender: string;
    email_recipient: string;
    message: string;
    date_message: Date;
    email_type: EmailType;
    is_read: boolean;
}

interface EmailBaseMethods {
    send(): Promise<void>;
}

interface IEFactory{
    id_email: string;
    name: string;
    email: string;
    tz: string;
    message: string;
    article_title?: string;
    article_link?: string;
    article_image?: string;
}

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

// interface to type the notificationTitle function...
interface INotificationTitle {
    title: string;
    num: number;
}

export { Emails, EmailType, EmailBaseMethods, IEFactory, MailOptions, INotificationTitle }