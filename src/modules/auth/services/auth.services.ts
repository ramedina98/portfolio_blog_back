/**
 * @module Auth
 *
 * This file contains all the necessary services for the auth module...
 *
 * These are the services required:
 * 1. Create New Account
 * 2. Login
 * 3. Password Recovery
 * 4. Update General Information
 * 5. Change Password
 * 6. Token for Session Refresh
 *
 * @author Ricardo Medina
 * @date 28/02/2025
 */
import { Injectable, BadRequestException } from "@nestjs/common"
import { PrismaService } from "src/database/service/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "../dto/auth.dto";
import { IUser, ResponseUser } from "src/interfaces/IAuth";
import { ErrorLoggerService } from "../../../common/exceptions/error-logger.service";
import { SERVER } from "src/config/config";
import * as bcrypt from 'bcrypt'
import logging from "src/config/logging";

@Injectable()
export class AuthService {
    private mysql: any;
    private logs: any;

    constructor(
        private readonly PrismaService:  PrismaService,
        private readonly logsService: ErrorLoggerService
    ) {
        this.mysql = PrismaService.getMySQL();
        this.logs = logsService;
    }

    // General log handling
    private MessageHandling(message: string, loggingType: keyof typeof logging): void {
        console.log("::::::::::::::::::::::::::::::::::::::::::::::::::");
        logging[loggingType](new Error(message));
        console.log("::::::::::::::::::::::::::::::::::::::::::::::::::");
    }

    /**
     * @method POST
     * Service to create new user...
     */
    async registerUser(dto: CreateUserDto): Promise<ResponseUser>{
        // First, check if the user already exits...
        const existingUser: IUser | null = await this.mysql.users.findFirst({
            where: {
                first_name: dto.first_name,
                first_surname: dto.first_surname,
                email: dto.email
            }
        });

        if(existingUser)    {
            // If the user already exists, throw an exception with a detailed message
            this.MessageHandling("Existing account", "warning");
            return {
                status: 400,
                message: `The entered email (${dto.email}) already has an associated account with the name ${existingUser.first_name} ${existingUser.first_surname}`,
                user: {}
            };
        }

        const hashedPassword: string = await bcrypt.hash(dto.password, 10);

        try {
            const user: IUser = await this.mysql.users.create({
                data: {
                    ...dto,
                    password: hashedPassword,
                },
            });

            return {
                status: 201,
                message: `Account successfully created for ${user.first_name} ${user.first_surname}`,
                user: {
                    name: user.first_name,
                    last_name: user.first_surname,
                    photo: user.photo
                }
            };
        } catch (error: any) {
            this.MessageHandling(`Error: ${error.message}`, "error");
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the registration service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to create user account');
        }
    }
}
