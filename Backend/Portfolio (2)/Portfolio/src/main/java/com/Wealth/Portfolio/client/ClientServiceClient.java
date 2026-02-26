package com.Wealth.Portfolio.client;

import com.Wealth.Portfolio.dto.ClientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// "client-service" must match the exact name of your Client Service in Eureka
@FeignClient(name = "client-service")
public interface ClientServiceClient {

    // The Interceptor we built will automatically add the JWT to this request!
    @GetMapping("/api/clients/{id}")
    ClientDTO getClientById(@PathVariable("id") Long id);
}