# Stage 1: Build Stage
FROM node:23-alpine AS build 

# Setting the working directory
WORKDIR /code

# Copy package.json and package-lock.json (or yarn.lock, etc.)
COPY package*.json .

# Install all dependencies (including dev dependencies) needed for the build process
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the build script defined in package.json 
RUN npm run build

# Stage 2: Production Runner Stage
# Start from the same clean, lean base image
FROM node:23-alpine AS runner 

# Set the working directory for the final application
WORKDIR /app

# Copy package files needed to install only production dependencies
COPY package*.json ./

# Install only production dependencies, omitting devDependencies
# Ensures a smaller and more secure final image
RUN npm install --omit=dev

# Copy the built application artifacts from the 'build' stage
COPY --from=build /code/dist ./dist

# Switch to the non-root 'node' user provided by the Node.js image
USER node

# Document the port the application will listen on internally
EXPOSE 8000

# Define the command to run the application
CMD [ "node", "dist/server.js" ]