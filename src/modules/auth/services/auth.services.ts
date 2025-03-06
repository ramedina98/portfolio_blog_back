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
import { Request, Response } from "express";
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
            const refreshT = await this.mysql.refreshToken.create({
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
     *
     * Service to verify the email address...
     */
    async verifyEmail(email: string, token: string, res: Response): Promise<any>{
        try {
            const payload: any = this.JwtService.verify(token);

            if(payload.payload.email !== email){
                logging.warning("Email does not match");
                res.redirect(`${SERVER.WEB}/notification?message=Email does not match&status=error`);
                return;
            }

            const user: IUser | null = await this.mysql.users.findFirst({
                where: {
                    email: email
                }
            });

            if(!user){
                logging.warning("User does not exists");
                res.redirect(`${SERVER.WEB}/notification?message=User does not exists&status=error`);
                return;
            }

            if(user.is_verified){
                logging.warning("User is already verified");
                res.redirect(`${SERVER.WEB}/notification?message=User is already verified&status=warning`);
                return;
            }

            // Update the user to verify the email...
            await this.mysql.users.update({
                where: {
                    id_user: user.id_user
                },
                data: {
                    is_verified: true
                }
            });

            logging.info("Email verified successfully");

            // The user is redirected to the login page...
            res.redirect(`${SERVER.WEB}/login`);
            return;
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the email verification service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to verify email');
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

    /**
     * @method POST
     * Service to refresh the token...
     * @param req - The request object
     * @param res - The response object
     * @returns - The new token
     * @returns - The new refresh token
     */
    async refreshToken(req: Request, res: Response): Promise<ResponseUser>{
        try {
            const refreshToken: string = req.cookies['refreshToken'];

            // First, check if the refresh token exists...
            const [token, revokeToken] = await Promise.all([
                this.mysql.refreshToken.findFirst({
                    where: {
                        token: refreshToken
                    }
                }),
                this.mysql.revokeToken.findFirst({
                    where: {
                        token: refreshToken
                    }
                })
            ]);

            if(!token || revokeToken){
                logging.warning("Invalid refresh token");
                return {
                    status: 400,
                    message: "Invalid refresh token",
                    user: {}
                }
            }

            // Verify the refresh token...
            const payload: any = this.JwtService.verify(refreshToken);

            // Delete the old refresh token...
            await Promise.all([
                this.mysql.refreshToken.delete({
                    where: {
                        id_refresh_token: token.id_refresh_token
                    }
                }),
                this.mysql.revokeToken.create({
                    data: {
                        token: refreshToken,
                        id_user: token.id_user
                    }
                })
            ]);

            const user: IUser | null = await this.mysql.users.findFirst({
                where: {
                    id_user: payload.id
                }
            });

            if(!user){
                logging.warning("User does not exists");
                return {
                    status: 404,
                    message: "User does not exists",
                    user: {}
                }
            }

            const newToken: string = this.JwtService.sign({
                payload: {
                    id: user.id_user,
                    email: user.email,
                    phone: user.phone,
                    create: user.created_at,
                    updated: user.updated_at
                }
            });

            const newRefreshToken: string = await this.refreshTokenProvider(user.id_user);
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: false, // HTTP - true, HTTPS - false
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return {
                status: 200,
                message: "Token refreshed successfully",
                token: newToken,
                user: {
                    name: user.first_name,
                    last_name: user.first_surname,
                    photo: user.photo
                }
            }

        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the refreshToken service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to refresh token');
        }
    }

    /**
     * @method POST
     * Service to logout...
     * @param req - The request object
     */
    async logoutUser(req: Request): Promise<ResponseUser>{
        try {
            const refreshToken: string = req.cookies['refreshToken'];

            if(!refreshToken){
                logging.warning("No refresh token provided");
                return {
                    status: 400,
                    message: "No refresh token provided",
                    user: {}
                }
            }

            const token = await this.mysql.refreshToken.findFirst({
                where: {
                    token: refreshToken
                }
            });

            await Promise.all([
                this.mysql.refreshToken.delete({
                    where: {
                        id_refresh_token: token.id_refresh_token
                    }
                }),
                this.mysql.revokeToken.create({
                    data: {
                        token: refreshToken,
                        id_user: token.id_user
                    }
                })
            ]);

            logging.info("Logout successfully");

            return {
                status: 200,
                message: "Logout successfully",
                user: {
                    name: "",
                    last_name: "",
                    photo: "",
                }
            }
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the logout service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to logout');
        }
    }

    /**
     * @method POST
     * Service to recover the password...
     * @param email - The email address of the user
     * @returns - A email to reset the password
     */
    async forgotPassword(email: string): Promise<ResponseUser>{
        try {
            // Frist, verify if the user exists...
            const user: IUser | null = await this.mysql.users.findFirst({
                where: {
                    email: email
                }
            });

            if(!user){
                logging.warning("User does not exists");
                return {
                    status: 404,
                    message: "No user found with that email address provided",
                    user: {}
                }
            }

            // Generate a token for password recovery...
            const token: string = this.JwtService.sign({
                payload: {
                    id: user.id_user,
                    email: user.email,
                    phone: user.phone,
                },
                expiresIn: "5m"
            });

            const subject: string = "Password Recovery";
            const message: string = `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Recuperación de Contraseña</title>
                </head>
                <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f5ece5;">
                <div class="container" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 8px 8px 0 0;">
                    <h2>Recuperación de Contraseña</h2>
                    </div>
                    <div class="content" style="padding: 20px;">
                    <p>Hola,</p>
                    <p>Recibimos una solicitud para restablecer tu contraseña. Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <p style="text-align: center;">
                        <a href="${SERVER.URL}/auth/reset-password?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #52769a; color: #ffffff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                    </p>
                    <p>Si no solicitaste un restablecimiento de contraseña, por favor ignora este correo.</p>
                    </div>
                    <div class="footer" style="text-align: center; padding: 10px 0; background-color: #cba17d; color: #ffffff; border-radius: 0 0 8px 8px;">
                    <p>&copy; ${new Date().getFullYear()} Ricardo Dev</p>
                    </div>
                </div>
                </body>
                </html>
            `;

            await this.emailService.sendEmail(email, subject, message);

            logging.info("Email sent successfully");
            return {
                status: 200,
                message: "An email has been sent to your email address with instructions to reset your password",
                user: {}
            }

        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the forgot password service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to recover password');
        }
    }

    /**
     * @method POST
     * Service to reset the password...
     * @param token - The token generated for the password recovery
     * @param password - The new password
     * @returns - A message indicating the success of the password reset
     */
    async resetPassword(token: string, res: Response): Promise<any>{
        try {
            const payload: any = this.JwtService.verify(token);

            // Check if the token is still valid...
            if(!payload){
                logging.warning("Invalid token");
                res.redirect(`${SERVER.WEB}/notification?message=Invalid token&status=error`);
                return;
            }

            // Check if the token has expired...
            const currentTime = Math.floor(Date.now() / 1000);
            if (payload.exp < currentTime) {
                logging.warning("Token expired");
                res.redirect(`${SERVER.WEB}/notification?message=Token expired&status=error`);
                return;
            }

            // if everithing is ok, the user is redirected to the change password page...
            logging.info("Token verified successfully, user redirected to change password page");
            res.redirect(`${SERVER.WEB}/change-password?token=${token}`);
            return;
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the reset password service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to reset password');
        }
    }

    /**
     * @method PUT
     * Service to change the password...
     * @param token - The token generated for the password recovery
     * @param password - The new password
     * @returns - A message indicating the success of the password change
     */
    async changePassword(token: string, password: string): Promise<ResponseUser>{
        const payload: any = this.JwtService.verify(token);

        // Check if the token is still valid...
        if(!payload){
            logging.warning("Invalid token");
            return {
                status: 400,
                message: "There was an error with the token provided",
                user: {}
            }
        }

        // Extrack the user id from the token...
        const id_user: string = payload.payload.id;

        try {
            // Hash the new password...
            const hashedPassword: string = await bcrypt.hash(password, 10);
            // Find the user and change the password...
            await this.mysql.users.update({
                where: {
                    id_user: id_user
                },
                data: {
                    password: hashedPassword
                }
            });

            logging.info("Password changed successfully");
            return {
                status: 200,
                message: "Password changed successfully",
                user: {}
            }
        } catch (error: any) {
            logging.error(`Error: ${error.message}`);
            // Error handling service, logs it to the database and notifies me via WhatsApp for quick action
            await this.logs.logError(
                "Error in the change password service",
                error.message,
                "back"
            );
            throw new BadRequestException('Failed to change password');
        }
    }
}
