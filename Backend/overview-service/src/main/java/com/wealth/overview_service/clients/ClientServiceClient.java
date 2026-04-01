package com.wealth.overview_service.clients;


import com.wealth.overview_service.config.FeignConfig;
import com.wealth.overview_service.dto.ClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// name = The exact application name of your Client Service in Eureka
@FeignClient(name = "client-service", configuration = FeignConfig.class)
public interface ClientServiceClient {

    // Matches the @GetMapping("/{id}") in your ClientController
    @GetMapping("/api/clients/{id}")
    ClientDTO getClientProfile(@PathVariable("id") Long id);
}