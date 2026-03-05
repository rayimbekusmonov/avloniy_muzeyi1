# 1-bosqich: Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Faqat pom.xml ni nusxalaymiz va dependency-larni yuklaymiz.
# Bu qatlam faqat pom.xml o'zgargandagina qayta ishlaydi.
COPY pom.xml .
RUN mvn dependency:go-offline -B

# 2. Endi kodni nusxalaymiz. 
# Agar faqat kod o'zgarsa, yuqoridagi dependency-lar qayta yuklanmaydi.
COPY src ./src

# 3. Build qilish (Testlarsiz)
RUN mvn clean package -DskipTests

# 2-bosqich: Runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Avvalgi bosqichdan faqat tayyor jar faylni olamiz
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
