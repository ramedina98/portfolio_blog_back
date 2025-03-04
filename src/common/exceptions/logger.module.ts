import { Module } from "@nestjs/common";
import { ErrorLoggerService } from "./error-logger.service";
import { PrismaModule } from "src/database/prisma.module";

@Module({
    imports: [PrismaModule],
    providers: [ErrorLoggerService],
    exports: [ErrorLoggerService]
})
export class LoggerModule {};