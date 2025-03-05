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
import { CreateUserDto, LoginUserDto} from "../dto/auth.dto";
import { IUser, ResponseUser } from "src/interfaces/IAuth";
import { ErrorLoggerService } from "../../../common/exceptions/error-logger.service";
import { SERVER } from "src/config/config";
import { EmailService } from "src/utils/email/email.service";
import { Response } from "express";
import * as bcrypt from 'bcrypt'
import logging from "src/config/logging";

@Injectable()
export class AuthService {
    private mysql: any;
    private logs: any;

    constructor(
        private readonly PrismaService:  PrismaService,
        private readonly logsService: ErrorLoggerService,
        private readonly JwtService: JwtService,
        private readonly emailService: EmailService
    ) {
        this.mysql = PrismaService.getMySQL();
        this.logs = logsService;
    }

    /**
     * Private Method to send an email to the user with a link to verify the email address...
     * It can be used in the registration service only...
     * @param email - The email address of the user
     * @param token - The token generated for the email verification
     * @returns boolean - True if the email was sent successfully, false otherwise
     */
    private async sendEmailVerification(email: string, token: string): Promise<boolean> {
        const subject: string = "Email Verification";
        const message: string = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verificación de Correo Electrónico</title>
            </head>
            <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5ece5;">
            <div class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <div class="header" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 8px 8px 0 0;">
                <h2>Verificación de Correo Electrónico</h2>
                </div>
                <div class="content" style="padding: 20px;">
                <p>Hola,</p>
                <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico:</p>
                <p style="text-align: center;">
                    <a href="${SERVER.URL}/auth/verify/${email}?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #52769a; color: #ffffff; text-decoration: none; border-radius: 5px;">Verificar Correo Electrónico</a>
                </p>
                <p>Si no te has registrado en nuestro sitio, por favor ignora este correo.</p>
                </div>
                <div class="footer" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 0 0 8px 8px;">
                <p>&copy; ${new Date().getFullYear()} Ricardo Dev</p>
                </div>
            </div>
            </body>
            </html>
        `;

        try {
            await this.emailService.sendEmail(email, subject, message);
            return true;
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error sending email verification",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to send email verification');
        }
    }

    /**
     * Generates a new refresh token for the given user ID and stores it in the database.
     *
     * @param id_user - The ID of the user for whom the refresh token is being generated
     * @returns refreshToken - The newly generated refresh token
     */
    private async refreshTokenProvider(id_user: string): Promise<string> {
        const refreshToken: string = this.JwtService.sign(
            {
                refresh: true,
                id: id_user
            },
            { expiresIn: SERVER.JRTIME}
        );

        try {
            const refreshT = await this.mysql.refreshTokens.create({
                data: {
                    id_user: id_user,
                    token: refreshToken
                }
            });

            return refreshT.token;
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the refreshTokenProvider service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to create refresh token');
        }
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
            logging.warning("Existing account");
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

            // Generate a token for email verification...
            const token: string = this.JwtService.sign({
                payload: {
                    id: user.id_user,
                    email: user.email,
                    phone: user.phone,
                    create: user.created_at,
                    updated: user.updated_at
                },
                expiresIn: "1d"
            });

            const wasEmailSend = await this.sendEmailVerification(dto.email, token);

            if(wasEmailSend){
                logging.info("Email sent successfully, and the process was completed successfully.");
            }

            return {
                status: 201,
                message: `Account successfully created for ${user.first_name} ${user.first_surname}. Verify your email address to activate your account.`,
                user: {
                    name: user.first_name,
                    last_name: user.first_surname,
                    photo: user.photo
                }
            };
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the registration service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to create user account');
        }
    }

    /**
     * @method POST
     * Service to login...
     */
    async loginUser(dto: LoginUserDto, res: Response): Promise<ResponseUser>{
        try {
            // first check if the user already exists...
            const existingUser: IUser | null = await this.mysql.users.findFirst({
                where: {
                    email: dto.email
                }
            });

            // First check if the user exists...
            if(!existingUser){
                logging.warning(`The user ${dto.email} does not exists.`)
                return {
                    status: 404,
                    message: "User does not exist!",
                    user: {}
                }
            }

            // Second check if was verify...
            if(!existingUser?.is_verified){
                logging.warning(`The user ${dto.email} is not verified.`)
                return {
                    status: 401,
                    message: "User is not verified!. Please verify your email address.",
                    user: {}
                }
            }

            // then compare the password provided and the password in the database...
            const isPasswordValid = await bcrypt.compare(dto.password, existingUser.password);
            if(!isPasswordValid){
                logging.warning("Password does not exists.");
                return {
                    status: 400,
                    message: "Password does not exists.",
                    user: {}
                }
            }

            // Sesion token...
            const token: string = this.JwtService.sign({
                payload: {
                    id: existingUser.id_user,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    create: existingUser.created_at,
                    updated: existingUser.updated_at
                }
            });

            const refreshToken: string = await this.refreshTokenProvider(existingUser.id_user);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // HTTP - true, HTTPS - false
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            logging.info("Login successfully");

            return {
                status: 200,
                message: `Welcome back ${existingUser.first_name} ${existingUser.first_surname}`,
                token: token,
                user: {
                    name: existingUser.first_name,
                    last_name: existingUser.first_surname,
                    photo: existingUser.photo
                }
            }
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the login service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to login');
        }
    }
}
