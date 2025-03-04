import { Test, TestingModule } from "@nestjs/testing";
import { ErrorLoggerService } from "../src/common/exceptions/error-logger.service";
import { PrismaService } from "src/database/service/prisma.service";
import { sendWhatsAppMessage } from "src/utils/whatsappSender";
import { SERVER } from "src/config/config";

jest.mock('../src/utils/whatsappSender', () => ({
    sendWhatsAppMessage: jest.fn(),
}));

describe('ErrorLoggerService', () => {
    let service: ErrorLoggerService;
    let prismaMock: any;

    beforeEach(async () => {
        prismaMock = {
            getMySQL: jest.fn().mockReturnValue({
                logs: { create: jest.fn() },
            }),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ErrorLoggerService,
                { provide: PrismaService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<ErrorLoggerService>(ErrorLoggerService);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    });

    it('Should save log to MySQL and send WhatsApp message', async () => {
        const mockError = { title: 'Error DB', summary: 'Failed Query' };
        await service.logError(mockError.title, mockError.summary, 'back');

        expect(prismaMock.getMySQL().logs.create).toHaveBeenLastCalledWith({
            data: {
                title_log: mockError.title,
                summary: mockError.summary,
                source: 'back'
            },
        });

        expect(sendWhatsAppMessage).toHaveBeenCalledWith(
            SERVER.ADMIN_WHATSAPP_NUMBER,
            `Ha ocurrido un error en la aplicación, dicho error es: ${mockError.summary}. Y se detecto en: back`
        );
    });

    it('Should handle database error gracefully', async () => {
        prismaMock.getMySQL().logs.create.mockRejectedValue(new Error('DB error'));

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        await service.logError('Test Error', 'Something went wrong', 'back');

        expect(consoleSpy).toHaveBeenCalledWith('Failed to save log: ', expect.any(Error));

        consoleSpy.mockRestore();
    });
});