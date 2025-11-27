# User Service (Clothify)

This is a simple Spring Boot User Service for the Clothify project.

## Features
- User registration & login (plain password for now)
- Email sending via Spring Mail (MailService)
- MariaDB (JDBC) using Spring Data JPA
- Java 21 / Spring Boot 3.3.x compatible

## Run
1. Configure `src/main/resources/application.properties` with your DB and mail credentials.
2. Build:
   mvn -DskipTests clean package
3. Run:
   mvn spring-boot:run
