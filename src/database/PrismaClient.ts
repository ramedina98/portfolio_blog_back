// Import MySQL Prisma client
import { PrismaClient as MySQLPrismaClient } from '../../prisma/generated/mysql';

// Import MongoDB Prisma client
import { PrismaClient as MongoDBPrismaClient } from '../../prisma/generated/mongodb';

// Initialize Prisma clients
const mysqlPrisma = new MySQLPrismaClient();

const mongodbPrisma = new MongoDBPrismaClient();

// Connect to MySQL and MongoDB
mysqlPrisma.$connect().catch((e) => {
    console.error('Error connecting to MySQL:', e);
    process.exit(1);
});

mongodbPrisma.$connect().catch((e) => {
    console.error('Error connecting to MongoDB:', e);
    process.exit(1);
});

// Export Prisma clients
export { mysqlPrisma, mongodbPrisma };