FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Dependency keshini yaratish
COPY pom.xml .
# Agar .mvn papkasi va mvnw fayli bo'lsa, ularni ham nusxalash keshga foyda beradi
COPY .mvn ./.mvn
COPY mvnw .
RUN ./mvnw dependency:go-offline -B

# 2. Faqat backend kodini nusxalash (frontend-ni emas!)
COPY backend/src ./src

# 3. Build
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]