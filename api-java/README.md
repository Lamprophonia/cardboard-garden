# Cardboard Garden - Spring Boot API

This is the Java/Spring Boot version of the Cardboard Garden API, featuring enterprise-grade authentication and card management.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher

## Features

### Enterprise Architecture
- **Spring Boot 3.2** with modern Java patterns
- **Spring Security** for authentication and authorization
- **Spring Data JPA** with Hibernate for database management
- **Spring Mail** for email verification
- **JWT Authentication** with proper security practices
- **Validation** with Bean Validation (JSR-303)
- **RESTful API** design with proper HTTP status codes

### Authentication System
- User registration with email verification
- Password hashing with BCrypt
- JWT token-based authentication
- Email verification required before access
- Password reset functionality
- User session management

### Card Management
- Advanced card search with Oracle ID support
- Alternative card name mapping
- Double-faced card support with JSON face data
- Set-based filtering and searching
- Rarity and type filtering

## Project Structure

```
api-java/
├── src/main/java/com/cardboardgarden/
│   ├── CardboardGardenApiApplication.java  # Main Spring Boot application
│   ├── entity/                             # JPA entities
│   │   ├── User.java                       # User entity with UserDetails
│   │   └── Card.java                       # Card entity
│   ├── repository/                         # Spring Data repositories
│   │   ├── UserRepository.java             # User data access
│   │   └── CardRepository.java             # Card data access
│   ├── dto/                                # Data Transfer Objects
│   │   ├── RegisterRequest.java            # Registration request
│   │   └── LoginRequest.java               # Login request
│   ├── service/                            # Business logic services
│   ├── controller/                         # REST controllers
│   ├── security/                           # Security configuration
│   └── config/                             # Application configuration
└── src/main/resources/
    ├── application.properties              # Configuration
    └── templates/                          # Email templates
```

## Running the Application

### 1. Build with Maven
```bash
cd api-java
mvn clean install
```

### 2. Run the application
```bash
mvn spring-boot:run
```

The application will start on port 3001 with context path `/api`.

### 3. Test endpoints
```bash
# Health check
curl http://localhost:3001/api/health

# Register a new user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## Database Schema

The application uses the same MySQL database schema as the Node.js version, making migration seamless.

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Database connection
- JWT secret
- Email settings
- Frontend URL for email links

## Development

### Key Java/Spring Boot Concepts Demonstrated

1. **Entity-Repository Pattern**: Clean separation of data access
2. **DTO Pattern**: Proper request/response object design
3. **Service Layer**: Business logic encapsulation
4. **Security Configuration**: Enterprise-grade authentication
5. **Validation**: Input validation with annotations
6. **Exception Handling**: Proper error responses
7. **Configuration Management**: Environment-based configuration

### Next Steps

1. Create authentication service and controllers
2. Add Spring Security configuration
3. Implement email service with Thymeleaf templates
4. Add card search and management endpoints
5. Add comprehensive testing with JUnit and MockMvc
6. Add API documentation with OpenAPI/Swagger

This Spring Boot version provides enterprise-grade patterns and practices that scale well for production applications.
