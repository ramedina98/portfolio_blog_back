import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Transporter } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { SERVER } from '../../config/config';

@Injectable()
export class EmailService {
    private hostName: string = SERVER.EHOST;
    private userName: string = SERVER.EUSER;
    private userPass: string = SERVER.EPASS;

    constructor(){
        this.hostName = SERVER.EHOST;
        this.userName = SERVER.EUSER;
        this.userPass = SERVER.EPASS;
    }

    private transport(): Transporter {
        return nodemailer.createTransport({
            host: this.hostName,
            port: 465,
            secure: true,
            auth: {
                user: this.userName,
                pass: this.userPass
            },
        });
    }

    async sendEmail(recipient: string, subject: string, message: string): Promise<SentMessageInfo> {
        try {
            const transport: Transporter = this.transport();
            return await transport.sendMail({
                from: SERVER.EUSER,
                to: recipient,
                subject: subject,
                html: message,
            });
        } catch (error: any) {
            throw new Error(`Error sending email: ${error.message}`);
        }
    }
}