# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy .env file
COPY .env ./

# Install nodemon globally
RUN npm install -g nodemon @nestjs/cli

# Copy the rest of the application code
COPY . .

# Generate Prisma clients
RUN npx prisma generate --schema=./app/prisma/mysql/schema.prisma
RUN npx prisma generate --schema=./app/prisma/mongodb/schema.prisma

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app with nodemon
CMD ["sh", "-c", "npm run prisma:migrate:mysql && npm run prisma:migrate:mongodb && nodemon --watch src --exec npm start"]