# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the rest of the application code
COPY . .

# Generate Prisma clients
RUN npx prisma generate --schema=./prisma/mysql/schema.prisma
RUN npx prisma generate --schema=./prisma/mongodb/schema.prisma

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app with nodemon
CMD ["nodemon", "--watch", "src", "--exec", "npm", "start"]