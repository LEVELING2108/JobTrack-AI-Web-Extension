# ------------------------------------------------------------------------------
# Stage 1: Build JAR with Maven & OpenJDK 21
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /workspace

# Copy Maven wrapper and POM for dependency caching
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and package application
COPY src src
RUN ./mvnw clean package -DskipTests -B

# ------------------------------------------------------------------------------
# Stage 2: Minimal JRE Runtime
# ------------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for container security
RUN addgroup -S jobtrack && adduser -S jobtrack -G jobtrack
USER jobtrack:jobtrack

# Copy executable jar from builder stage
COPY --from=builder --chown=jobtrack:jobtrack /workspace/target/*.jar app.jar

ENV SERVER_PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=5s --retries=5 --start-period=30s \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
