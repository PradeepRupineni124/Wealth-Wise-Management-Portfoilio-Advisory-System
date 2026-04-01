package com.wealth.advisory.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "recommendation")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long recommendationID;

    private Long portfolioID;

    // This will store the complex UI JSON data as a single string!
    @Column(columnDefinition = "TEXT")
    private String suggestedAction;

    private Date date;

    private String status; // PENDING, ACCEPTED
}