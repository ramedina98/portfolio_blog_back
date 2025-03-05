import { Twilio } from 'twilio';
import { SERVER } from '../config/config';

const client = new Twilio(SERVER.WS_SID, SERVER.WS_TOKEN);

export const sendWhatsAppMessage = async (to: string, message: string): Promise<void> => {
    try {
        await client.messages.create({
            body: message,
            from: `whatsapp:${SERVER.TWS_NUMBER}`,
            to: `whatsapp:${to}`,
        });
        console.log('WhatsApp message sent successfully');
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};