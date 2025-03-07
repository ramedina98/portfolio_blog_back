/**
 * @module emails.controller
 * @description
 * Controller for the email module.
 *
 * @author Ricardo Medina
 * @date 2021-09-02
 */
import { Controller } from "@nestjs/common";
import { JwtAuthGuard } from "src/security/guards/jwt-auth.guard";
import { EmailService } from "src/utils/email/email.service";

@Controller('email')
export class EmailsController {
    constructor(
        private readonly emailsService: EmailService
    ) {}
}