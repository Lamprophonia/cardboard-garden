package com.cardboardgarden.repository;

import com.cardboardgarden.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Find user by username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find user by username or email (for login)
     */
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);
    
    /**
     * Find user by email verification token
     */
    Optional<User> findByEmailVerificationToken(String token);
    
    /**
     * Find user by password reset token
     */
    Optional<User> findByPasswordResetToken(String token);
    
    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find users with expired verification tokens
     */
    @Query("SELECT u FROM User u WHERE u.emailVerificationExpires < :now AND u.emailVerified = false")
    java.util.List<User> findUsersWithExpiredVerificationTokens(@Param("now") LocalDateTime now);
    
    /**
     * Find users with expired password reset tokens
     */
    @Query("SELECT u FROM User u WHERE u.passwordResetExpires < :now AND u.passwordResetToken IS NOT NULL")
    java.util.List<User> findUsersWithExpiredPasswordResetTokens(@Param("now") LocalDateTime now);
    
    /**
     * Clear expired verification tokens
     */
    @Modifying
    @Query("UPDATE User u SET u.emailVerificationToken = NULL, u.emailVerificationExpires = NULL " +
           "WHERE u.emailVerificationExpires < :now AND u.emailVerified = false")
    void clearExpiredVerificationTokens(@Param("now") LocalDateTime now);
    
    /**
     * Clear expired password reset tokens
     */
    @Modifying
    @Query("UPDATE User u SET u.passwordResetToken = NULL, u.passwordResetExpires = NULL " +
           "WHERE u.passwordResetExpires < :now")
    void clearExpiredPasswordResetTokens(@Param("now") LocalDateTime now);
}
