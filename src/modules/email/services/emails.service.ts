/**
 * @module email
 * @description
 * Service for the email module.
 *
 * This service is responsible for saving emails in the database and
 * uses the email factory to redirect responses and manage
 * communication with clients and users of the blog and portfolio.
 *
 * @author Ricardo Medina
 * @date 2021-09-02
 */
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/database/service/prisma.service";
import { LoggerService } from "@nestjs/common";
import logging from "src/config/logging";


@Injectable()
export class EmailsService {
    private mysql: any;
    constructor(
        private readonly prismaService: PrismaService,
        private readonly logger: LoggerService
    ){
        this.mysql = this.prismaService.getMySQL();
    }
}