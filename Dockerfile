# Use the official Node.js image as the base image
FROM node:20

# Set the working directory inside the container
WORKDIR /fenex-frontend-reactjs

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
