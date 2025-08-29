# Stage 1: Build ứng dụng
FROM maven:3.9.9-eclipse-temurin-22 AS build

WORKDIR /app

# Copy file cấu hình Maven trước để cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ source code và build
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Chạy ứng dụng
FROM eclipse-temurin:22-jdk

WORKDIR /app

# Copy file jar từ stage build
COPY --from=build /app/target/*.jar app.jar

# Expose port (ví dụ 8080)
EXPOSE 8080

# Lệnh chạy Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]

