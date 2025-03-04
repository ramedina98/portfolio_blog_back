import { Module } from "@nestjs/common";
import { AuthService } from "./services/auth.services";
import { AuthController } from "./controller/auth.controller";
import { PrismaModule } from "src/database/prisma.module";
import { LoggerModule } from "src/common/exceptions/logger.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { SERVER } from "src/config/config";
import { SecurityModule } from "src/security/security.module";

@Module({
    imports: [
        SecurityModule,
        PrismaModule,
        LoggerModule,
        PassportModule,
        JwtModule.register({
            secret: SERVER.JWTKEY,
            signOptions: { expiresIn: SERVER.JTIME }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {};