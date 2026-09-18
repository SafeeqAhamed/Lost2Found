# Use Java 21 as the base image
FROM eclipse-temurin:21-jdk

# Set /app as the working folder inside the container
WORKDIR /app

# Copy the entire backend project into the container
COPY . .

# Install Maven, which is needed to build the Spring Boot project
RUN apt-get update && apt-get install -y maven

# Build the Spring Boot project and create the JAR file
RUN mvn clean package -DskipTests

# Tell Docker that the application uses port 8081
# Render provides the PORT environment variable.
# If PORT is not provided, the application defaults to port 8081.
EXPOSE 8081

# Start the Spring Boot application using the generated JAR file
CMD ["java", "-jar", "target/lostfound-0.0.1-SNAPSHOT.jar"]


# FROM    → Get Java
# WORKDIR → Create working folder
# COPY    → Put project inside
# RUN     → Install Maven
# RUN     → Build project
# EXPOSE  → Tell the port
# CMD     → Start the application
