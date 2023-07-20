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
# WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig*.json ./
# copy ./main directory into the image
# copy tsconfig.json and tslint.json needed to build the project
COPY ./main ./
# install dependencies
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "stats3" ]
