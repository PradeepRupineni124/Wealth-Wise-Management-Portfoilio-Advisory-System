package com.Wealth.Project.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            log.info("Sending OTP email to: {}", toEmail);
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP");
            message.setText("Your OTP is: " + otp + "\nIt expires in 15 minutes.");
            mailSender.send(message);
            log.info("Email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email");
        }
    }
}