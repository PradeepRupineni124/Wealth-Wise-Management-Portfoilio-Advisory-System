package com.Wealth.Project.restController;

import com.Wealth.Project.dto.*;
import com.Wealth.Project.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal; // <-- WAS MISSING
import org.springframework.security.core.userdetails.UserDetails;         // <-- WAS MISSING
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
//@CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {

        try {
            byte[] decodedEmailBytes = Base64.getDecoder().decode(request.getEmail());
            String decodedEmail = new String(decodedEmailBytes);
            request.setEmail(decodedEmail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Email Encoding");
        }
        try {
            byte[] decodedPassBytes = Base64.getDecoder().decode(request.getPassword());
            String decodedPass = new String(decodedPassBytes);
            request.setPassword(decodedPass);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid Password Encoding");
        }

        // Since we removed @Email, we should check it here manually if we want to be safe
        if (!request.getEmail().contains("@") || !request.getEmail().contains(".")) {
            return ResponseEntity.badRequest().body("Invalid Email Format");
        }

        return ResponseEntity.status(201).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {

        try {
            byte[] decodedEmailBytes = Base64.getDecoder().decode(request.getEmail());
            String decodedEmail = new String(decodedEmailBytes);
            request.setEmail(decodedEmail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build(); // or throw custom exception
        }

        try {
            byte[] decodedPassBytes = Base64.getDecoder().decode(request.getPassword());
            String decodedPass = new String(decodedPassBytes);
            request.setPassword(decodedPass);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

//        if (!request.getEmail().contains("@") || !request.getEmail().contains(".")) {
//            return ResponseEntity.badRequest().body("Invalid Email Format");
//        }

        return ResponseEntity.ok(authService.login(request));
    }

    // 1. GET CURRENT USER (Protected by JWT)
    @GetMapping("/me")
    public ResponseEntity<AdvisorResponse> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // userDetails.getUsername() will contain the email from the JWT
        return ResponseEntity.ok(authService.getMe(userDetails.getUsername()));
    }

    // 2. FORGOT PASSWORD (Send OTP)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        authService.generateOtp(request.get("email"));
        return ResponseEntity.ok("OTP sent to email");
    }

    // 3. VERIFY OTP (Middle Step)
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("OTP Verified Successfully");
    }

    // 4. RESET PASSWORD (Final Step)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok("Password Reset Successfully");
    }
}