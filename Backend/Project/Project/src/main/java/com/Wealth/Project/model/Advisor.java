package com.Wealth.Project.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "advisor")
public class Advisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long advisorId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String fullName;

    @Column(columnDefinition = "boolean default false")
    private boolean isOtpVerified;
    // --- OTP Columns (Merged here as requested) ---
    private String resetOtp;
    private LocalDateTime resetOtpExpiry;

}