# Use an official Node runtime as the base image
FROM node:18-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Display the content of package.json for debugging
RUN cat package.json

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Display the content of package.json again to ensure it hasn't changed
RUN cat package.json

# List the contents of the scripts section
RUN npm run | grep -A 10 "Scripts available"

# Build the application
RUN npm run build

# Expose port 3000 for the application
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]

