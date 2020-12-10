## Deploy application to docker using docker-compose.
-----
### Docker Configuration Steps for front-end client

1. Create file called "Dockerfile" and add the following lines, be sure to change version to a number i.e: 12.14.1 Use node -v to find version
```
FROM node:12.14.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm install
RUN npm run build
# start app
CMD ["npm", "start"]
EXPOSE 3000
```
2. Create .dockerignore file and add in the following lines
```
node_modules
npm-debug.log
```
----
#### Docker Build Steps
1. Build docker first
```
docker build -t activities-client .
```
2. Run docker to test.
```
docker run -tdi -p 3000:3000 --name client activities-client
```
-----
### Docker Configuration Steps for back-end api
1. Create file called "Dockerfile" and add the following lines, be sure to change version of sdk.
```
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY . ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app

COPY --from=build-env /app/out .
ENTRYPOINT ["dotnet", "API.dll"]

```
----
#### Docker Build Steps
1. Build docker first
```
docker build -t activities-api .
```
2. Run docker to test.
```
docker run -d -p 5000:80 --name api activities-api
```

### Use DOCKER-COMPOSE configuration file to start your entire application
1. Create file called "docker-compose.yml" and add the following lines.
```
version: "3.7"
services:
  api:
    build: ./docker-activities-api-main
    ports: 
      - '5000:80'
  client:
    build: ./docker-activities-client-main/clientapp
    stdin_open: true
    tty: true
    ports: 
      - '3000:3000'
```
2.Run docker-compose to test 
```
docker-compose up -d --build
```
------
## Your entire application up and running with docker containers
------
# Next ...
### Host application to AWS
  - Set Up a CI/CD Pipeline on AWS 
  - Deploy application to AWS Fargate 
