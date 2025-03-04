import { Controller, Get, Post, Put, Delete, Body } from "@nestjs/common";
import { AuthService } from "../services/auth.services";
import { CreateUserDto } from "../dto/auth.dto";

@Controller('auth')
export class AuthController {
    /**
     * Registers a new user.
     *
     * This method is responsible for creating a new user...
     * @returns A string indicating the success of the registration.
     */
    constructor(
        private readonly authService: AuthService
    ) {}

    // New User Register Controller...
    @Post("register")
    async register(@Body() dto: CreateUserDto) {
        return this.authService.registerUser(dto);
    }
}