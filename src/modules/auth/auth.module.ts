import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.services";
import { AuthController } from "./controller/auth.controller";
import { PrismaModule } from "src/database/prisma.module";
import { LoggerModule } from "src/common/exceptions/logger.module";

@Module({
    imports: [PrismaModule, LoggerModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {};