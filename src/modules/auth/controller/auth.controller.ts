import { Controller, Get, Post, Put, Delete, Body, Query, Res } from "@nestjs/common";
import { AuthService } from "../services/auth.services";
import { CreateUserDto, LoginUserDto } from "../dto/auth.dto";
import { Response } from "express";
import { JwtAuthGuard } from "src/security/guards/jwt-auth.guard";

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

    // Login controller...
    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res() res: Response) {
        return this.authService.loginUser(dto, res);
    }
}