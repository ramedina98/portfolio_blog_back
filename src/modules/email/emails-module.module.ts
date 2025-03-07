import { Module } from "@nestjs/common";
import { EmailsService } from "./services/emails.service";
import { EmailsController } from "./controller/emails.controller";
import { SecurityModule } from "src/security/security.module";
import { PrismaModule } from "src/database/prisma.module";
import { LoggerModule } from "src/common/exceptions/logger.module";

@Module({
    imports: [
        SecurityModule,
        PrismaModule,
        LoggerModule
    ],
    controllers: [EmailsController],
    providers: [EmailsService],
    exports: [EmailsService]
})
export class EmailsModule {};