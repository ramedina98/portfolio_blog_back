import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { SERVER } from "src/config/config";

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: SERVER.JWTKEY,
            signOptions: { expiresIn: SERVER.JTIME },
        }),
    ],
    providers: [JwtStrategy, JwtAuthGuard],
    exports: [JwtAuthGuard],
})
export class SecurityModule {}
