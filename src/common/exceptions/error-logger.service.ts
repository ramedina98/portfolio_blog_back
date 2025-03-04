import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/service/prisma.service";
import { sendWhatsAppMessage } from "../../utils/whatsappSender"
import { SERVER } from "src/config/config";

@Injectable()
export class ErrorLoggerService {
    private mysql: any;
    constructor(private readonly prisma: PrismaService) {
        this.mysql = prisma.getMySQL();
    };

    async logError(title: string, summary: string, source: 'back' | 'front') {
        try {
            // create a record of the error in the database...
            await this.mysql.logs.create({
                data: {
                    title_log: title,
                    summary,
                    source
                }
            });
            // then send a error message (whats app)...
            const message: string = `Ha ocurrido un error en la aplicación, dicho error es: ${summary}. Y se detecto en: ${source}`;
            sendWhatsAppMessage(SERVER.ADMIN_WHATSAPP_NUMBER, message);
        } catch (error: any) {
            console.log(`Failed to save log: `, error);
        }
    }
}