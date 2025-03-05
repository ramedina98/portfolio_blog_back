import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { IJwtPlayLoad } from "src/interfaces/IAuth";
import { SERVER } from "src/config/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: SERVER.JWTKEY,
        });
    }

    async validate(payload: IJwtPlayLoad) {
        return {
            id: payload.id,
            email: payload.email,
            phone: payload.phone,
            create: payload.create,
            updated: payload.updated
        };
    }
}
