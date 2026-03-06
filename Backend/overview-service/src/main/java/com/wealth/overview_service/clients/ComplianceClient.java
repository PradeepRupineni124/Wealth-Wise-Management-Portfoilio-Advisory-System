package com.wealth.overview_service.clients;

import com.wealth.overview_service.dto.ComplianceAuditLogDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.List;

@FeignClient(name = "compliance-service")
public interface ComplianceClient {
    @GetMapping("/api/compliance/audit-logs/client/{clientId}")
    List<ComplianceAuditLogDTO> getAuditLogsByClient(@PathVariable("clientId") Long clientId);
}