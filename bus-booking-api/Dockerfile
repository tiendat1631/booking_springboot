# Sử dụng builder để build jar
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
# Copy pom.xml trước để tận dụng cache của Docker cho dependencies
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]