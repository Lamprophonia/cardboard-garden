package com.cardboardgarden.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private TemplateEngine templateEngine;
    
    @Value("${spring.mail.from}")
    private String fromEmail;
    
    @Value("${app.base-url}")
    private String baseUrl;
    
    /**
     * Send email verification email
     */
    public void sendVerificationEmail(String toEmail, String firstName, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Cardboard Garden Account");
            
            // Create template context
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("verificationUrl", baseUrl + "/api/auth/verify-email?token=" + verificationToken);
            context.setVariable("baseUrl", baseUrl);
            
            // Process the template
            String htmlContent = templateEngine.process("verification-email", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Verification email sent to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send verification email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String firstName, String resetToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Cardboard Garden Password");
            
            // Create template context
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("resetUrl", baseUrl + "/reset-password?token=" + resetToken);
            context.setVariable("baseUrl", baseUrl);
            
            // Process the template
            String htmlContent = templateEngine.process("password-reset-email", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
    
    /**
     * Send welcome email after email verification
     */
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Cardboard Garden!");
            
            // Create template context
            Context context = new Context();
            context.setVariable("firstName", firstName);
            context.setVariable("baseUrl", baseUrl);
            
            // Process the template
            String htmlContent = templateEngine.process("welcome-email", context);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("Welcome email sent to: {}", toEmail);
            
        } catch (MessagingException e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            // Don't throw exception for welcome email - it's not critical
            logger.warn("Welcome email failed, but continuing with user registration");
        }
    }
}
