package com.wealthwise.compliance.client;

import com.wealthwise.compliance.config.FeignConfig;
import com.wealthwise.compliance.dto.ClientDataDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Feign client for Client/User Service communication
 * Retrieves client profile data for compliance verification
 */
@FeignClient(name = "client-service", url = "${feign.client.config.client-service.url:http://localhost:8081}", configuration = FeignConfig.class)
public interface ClientClient {

    /**
     * Fetch client data by client ID
     * FIX: Changed from /api/client/ to /api/clients/
     */
    @GetMapping("/api/clients/{clientId}")
    ClientDataDTO getClientData(@PathVariable("clientId") Long clientId);

    /**
     * Fetch KYC status only
     * FIX: Changed from /api/client/ to /api/clients/
     */
    @GetMapping("/api/clients/{clientId}/kyc-status")
    String getKycStatus(@PathVariable("clientId") Long clientId);
}