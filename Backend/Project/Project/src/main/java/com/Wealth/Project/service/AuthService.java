package com.Wealth.Project.service;

import com.Wealth.Project.Exception.BadRequestException;
import com.Wealth.Project.Exception.ResourceNotFound;
import com.Wealth.Project.dto.*;
import com.Wealth.Project.model.Advisor;
import com.Wealth.Project.repository.AdvisoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // Import Lombok Slf4j
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j // Enables 'log'
public class AuthService {
    private final AdvisoryRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    // 1. REGISTER
    public String register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        if (repository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email already exists");
        }

        Advisor advisor = Advisor.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        repository.save(advisor);
        log.info("User registered successfully: {}", request.getEmail());
        return "Advisor registered successfully";
    }

    // 2. LOGIN
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        Advisor advisor = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("Login failed. User not found: {}", request.getEmail());
                    return new BadCredentialsException("Invalid Email or Password");
                });

        if (!passwordEncoder.matches(request.getPassword(), advisor.getPassword())) {
            log.error("Login failed. Incorrect password for: {}", request.getEmail());
            throw new BadCredentialsException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(advisor.getEmail());
        log.info("Login successful for: {}", request.getEmail());

        return new AuthResponse("Login Successful", token);
    }

    public AdvisorResponse getMe(String email) {
        log.debug("Fetching details for current user: {}", email);
        Advisor advisor = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFound("User not found"));

        return new AdvisorResponse(
                advisor.getAdvisorId(),
                advisor.getFullName(),
                advisor.getEmail()
        );
    }

    // 3. FORGOT PASSWORD (Send OTP)
    public void generateOtp(String email) {
        log.info("Password reset requested for: {}", email);

        Advisor advisor = repository.findByEmail(email)
                .orElseThrow(() -> {
                    log.warn("Password reset failed. User not found: {}", email);
                    return new ResourceNotFound("User not found");
                });

        String otp = String.format("%04d", new Random().nextInt(10000));

        advisor.setResetOtp(otp);
        advisor.setResetOtpExpiry(LocalDateTime.now().plusMinutes(15));
        advisor.setOtpVerified(false);

        repository.save(advisor);

        // Note: Do not log the actual OTP
        emailService.sendOtpEmail(email, otp);
        log.info("OTP sent successfully to: {}", email);
    }

    // 4. VERIFY OTP
    public void verifyOtp(String email, String otp) {
        log.info("Verifying OTP for: {}", email);

        Advisor advisor = repository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFound("User not found"));

        if (advisor.getResetOtp() == null || !advisor.getResetOtp().equals(otp)) {
            log.warn("OTP verification failed. Invalid OTP for: {}", email);
            throw new BadRequestException("Invalid OTP");
        }
        if (advisor.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
            log.warn("OTP verification failed. OTP expired for: {}", email);
            throw new BadRequestException("OTP has expired");
        }

        advisor.setOtpVerified(true);
        repository.save(advisor);
        log.info("OTP verified successfully for: {}", email);
    }

    // 5. RESET PASSWORD
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password for: {}", request.getEmail());

        Advisor advisor = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFound("User not found"));

        if (!advisor.isOtpVerified()) {
            log.error("Password reset blocked. OTP not verified for: {}", request.getEmail());
            throw new BadRequestException("You must verify the OTP first before resetting password.");
        }

        advisor.setPassword(passwordEncoder.encode(request.getNewPassword()));
        advisor.setResetOtp(null);
        advisor.setResetOtpExpiry(null);
        advisor.setOtpVerified(false);

        repository.save(advisor);
        log.info("Password reset successfully for: {}", request.getEmail());
    }
}