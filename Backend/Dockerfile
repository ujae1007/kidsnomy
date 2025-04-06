# react 18.2.0
# Base image with Node.js and npm
FROM openjdk:17-jdk-alpine AS base

# Set working directory inside the container
WORKDIR /app

# Copy the entire project to the container
COPY ./kidsnomy .

# gradlew 실행 권한 부여
RUN chmod +x ./gradlew

# # Expose development port
# EXPOSE 8080

# Default command to start the development server
CMD ["sh", "-c", "./gradlew bootJar --no-daemon -x test && java -jar build/libs/kidsnomy-0.0.1-SNAPSHOT.jar"]
# CMD ["tail", "-f", "/dev/null"]