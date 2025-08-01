package com.cardboardgarden.service;

import com.cardboardgarden.dto.LoginRequest;
import com.cardboardgarden.dto.RegisterRequest;
import com.cardboardgarden.entity.User;
import com.cardboardgarden.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthService implements UserDetailsService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;
    
    @Value("${app.verification.expiration}")
    private int verificationExpiration;
    
    /**
     * Register a new user
     */
    public Map<String, Object> register(RegisterRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if username already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                response.put("success", false);
                response.put("message", "Username already exists");
                return response;
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                response.put("success", false);
                response.put("message", "Email already registered");
                return response;
            }
            
            // Create new user
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmailVerified(false);
            user.setIsActive(true);
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            
            // Generate email verification token
            String verificationToken = UUID.randomUUID().toString();
            user.setEmailVerificationToken(verificationToken);
            user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(verificationExpiration));
            
            // Save user
            user = userRepository.save(user);
            
            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);
            
            response.put("success", true);
            response.put("message", "Registration successful. Please check your email to verify your account.");
            response.put("userId", user.getUserId());
            
            logger.info("User registered successfully: {}", request.getUsername());
            
        } catch (Exception e) {
            logger.error("Registration failed for user: {}", request.getUsername(), e);
            response.put("success", false);
            response.put("message", "Registration failed. Please try again.");
        }
        
        return response;
    }
    
    /**
     * Login user
     */
    public Map<String, Object> login(LoginRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Find user by username or email
            Optional<User> userOpt = userRepository.findByUsernameOrEmail(request.getLogin());
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }
            
            User user = userOpt.get();
            
            // Check password
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                response.put("success", false);
                response.put("message", "Invalid credentials");
                return response;
            }
            
            // Check if account is active
            if (!user.getIsActive()) {
                response.put("success", false);
                response.put("message", "Account is deactivated");
                return response;
            }
            
            // Check if email is verified
            if (!user.getEmailVerified()) {
                response.put("success", false);
                response.put("message", "Please verify your email before logging in");
                return response;
            }
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            // Generate JWT token
            String token = generateToken(user);
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", Map.of(
                "userId", user.getUserId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName()
            ));
            
            logger.info("User logged in successfully: {}", user.getUsername());
            
        } catch (Exception e) {
            logger.error("Login failed for: {}", request.getLogin(), e);
            response.put("success", false);
            response.put("message", "Login failed. Please try again.");
        }
        
        return response;
    }
    
    /**
     * Verify email address
     */
    public Map<String, Object> verifyEmail(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmailVerificationToken(token);
            
            if (userOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Invalid verification token");
                return response;
            }
            
            User user = userOpt.get();
            
            // Check if token is expired
            if (user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                response.put("success", false);
                response.put("message", "Verification token has expired");
                return response;
            }
            
            // Verify email
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            user.setEmailVerificationTokenExpiry(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "Email verified successfully");
            
            logger.info("Email verified for user: {}", user.getUsername());
            
        } catch (Exception e) {
            logger.error("Email verification failed for token: {}", token, e);
            response.put("success", false);
            response.put("message", "Email verification failed. Please try again.");
        }
        
        return response;
    }
    
    /**
     * Request password reset
     */
    public Map<String, Object> requestPasswordReset(String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                // Don't reveal if email exists or not
                response.put("success", true);
                response.put("message", "If the email exists, a password reset link will be sent");
                return response;
            }
            
            User user = userOpt.get();
            
            // Generate password reset token
            String resetToken = UUID.randomUUID().toString();
            user.setPasswordResetToken(resetToken);
            user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
            
            // Send password reset email
            emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
            
            response.put("success", true);
            response.put("message", "If the email exists, a password reset link will be sent");
            
            logger.info("Password reset requested for user: {}", user.getUsername());
            
        } catch (Exception e) {
            logger.error("Password reset request failed for email: {}", email, e);
            response.put("success", false);
            response.put("message", "Password reset request failed. Please try again.");
        }
        
        return response;
    }
    
    /**
     * Generate JWT token
     */
    private String generateToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);
        
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("userId", user.getUserId())
                .claim("email", user.getEmail())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    
    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            logger.error("Invalid JWT token", e);
            return false;
        }
    }
    
    /**
     * Get username from JWT token
     */
    public String getUsernameFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }
    
    /**
     * UserDetailsService implementation for Spring Security
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOpt = userRepository.findByUsernameOrEmail(username);
        
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        
        return userOpt.get();
    }
    
    /**
     * Clean up expired tokens
     */
    public void cleanupExpiredTokens() {
        try {
            userRepository.clearExpiredVerificationTokens(LocalDateTime.now());
            userRepository.clearExpiredPasswordResetTokens(LocalDateTime.now());
            logger.info("Expired tokens cleaned up");
        } catch (Exception e) {
            logger.error("Failed to cleanup expired tokens", e);
        }
    }
}
