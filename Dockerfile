# create a new image from the base nodejs 10 image and as entrypoint run npm run stats3
FROM node:18.17 
# Update the system
# Update the system
RUN apt-get update

# Install curl and build-essential
RUN apt-get install -y curl build-essential

# Install Rust and Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Add the cargo bin directory to PATH
ENV PATH="/root/.cargo/bin:${PATH}"
# Set the working directory
WORKDIR /usr/src/app

# Copy package*.json, tsconfig.json, and tangle.json
COPY package*.json ./
COPY tsconfig.json ./
COPY tangle.json ./
COPY entrypoint.sh ./entrypoint.sh

# Copy ./main and ./test directories into the image
COPY ./main ./main
COPY ./test ./test
# install dependencies
RUN yarn
RUN yarn build

EXPOSE 3000
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
