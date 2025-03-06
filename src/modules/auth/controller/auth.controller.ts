import { Controller, Get, Post, Put, Delete, Body, Query, Req, Res, Param, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.services";
import { CreateUserDto, LoginUserDto, ChangePasswordDto } from "../dto/auth.dto";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/security/guards/jwt-auth.guard";

/**
 * TODO: faltan los siguientes controllers:
 * - Update Password...
 */

@Controller('auth')
export class AuthController {
    /**
     * Registers a new user.
     *
     * This method is responsible for creating a new user in the administrator app...
     * @returns A string indicating the success of the registration.
     */
    constructor(
        private readonly authService: AuthService
    ) {}

    // New User Register Controller...
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        return this.authService.registerUser(dto);
    }

    // Verify User Controller...
    @Get('verify/:email')
    async verify(@Query('token') token: string, @Param('email') email: string, @Res() res: Response) {
        return this.authService.verifyEmail(email, token, res);
    }

    // Login controller...
    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.loginUser(dto, res);
    }

    // Refresh token controller...
    @Post('refresh')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.refreshToken(req, res);
    }

    // Logout controller...
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req: Request) {
        return this.authService.logoutUser(req);
    }

    // Forgot password controller...
    @Post('forgot')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.forgotPassword(email);
    }

    // Reset password controller...
    @Post('reset-password')
    async resetPassword(@Query('token') token: string, @Res() res: Response) {
        return this.authService.resetPassword(token, res);
    }

    // Change password controller...
    @Put('change-password')
    async changePassword(@Query('token') token: string, @Body('password') password: string) {
        return this.authService.changePassword(token, password);
    }

    // Update password controller...
    @UseGuards(JwtAuthGuard)
    @Put('update-password')
    async updatePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
        return this.authService.updatePassword(req, dto.old_password, dto.new_password);
    }
}