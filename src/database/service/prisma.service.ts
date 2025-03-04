import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient as MySQLPrismaClient } from "../../../prisma/generated/mysql";
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/generated/mongodb";
import logging from "src/config/logging";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    private readonly mysql: MySQLPrismaClient;
    private readonly mongo: MongoDBPrismaClient;

    constructor() {
        this.mysql = new MySQLPrismaClient();
        this.mongo = new MongoDBPrismaClient();
    }

    async onModuleInit() {
        try {
            await this.mysql.$connect();
            logging.info("Connected to Mysql");
        } catch (error: any) {
            logging.error("Error connecting to MySQL: ", error.message);
            process.exit(1);
        }

        try {
            await this.mongo.$connect();
            logging.info("Connected to MongoDB");
        } catch (error: any) {
            logging.error("Error connecting to MongoDB: ", error.message);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.mysql.$disconnect();
        await this.mongo.$disconnect();
    }

    getMySQL() {
        return this.mysql;
    }

    getMongoDB() {
        return this.mongo;
    }
}