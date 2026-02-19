package com.Wealth.Compliance.dto;

import com.Wealth.Compliance.model.ComplianceReport;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceReportRequest {

    @NotBlank(message = "Report title is required")
    @Size(min = 5, max = 200, message = "Report title must be between 5 and 200 characters")
    private String reportTitle;

    @NotNull(message = "Report type is required")
    private ComplianceReport.ReportType reportType;

    @NotNull(message = "Report period start date is required")
    @PastOrPresent(message = "Report period start date cannot be in the future")
    private LocalDate reportPeriodStart;

    @NotNull(message = "Report period end date is required")
    @PastOrPresent(message = "Report period end date cannot be in the future")
    private LocalDate reportPeriodEnd;

    @Size(max = 3000, message = "Summary cannot exceed 3000 characters")
    private String summary;

    @Size(max = 2000, message = "Recommendations cannot exceed 2000 characters")
    private String recommendations;

    private String generatedBy;
}
