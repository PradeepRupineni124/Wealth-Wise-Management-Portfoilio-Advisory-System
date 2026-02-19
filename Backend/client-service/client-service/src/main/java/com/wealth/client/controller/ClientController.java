package com.wealth.client.controller;

import com.wealth.client.model.Client;
import com.wealth.client.service.ClientService;
import com.wealth.client.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@Slf4j // Enables Logging
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private JwtUtil jwtUtil; // Inject the JWT Utility to read tokens

    // Helper method to process the Bearer Token
    private Long getAdvisorId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Unauthorized Access Attempt: Missing or invalid Authorization header");
            throw new RuntimeException("Unauthorized: Missing Token");
        }
        // Use the utility to decode the token and get the ID
        return jwtUtil.extractAdvisorId(authHeader);
    }

    @GetMapping
    public ResponseEntity<List<Client>> getMyClients(@RequestHeader("Authorization") String authHeader) {
        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: GET /api/clients from Advisor ID: {}", advisorId);
        return ResponseEntity.ok(clientService.getAllClients(advisorId));
    }

    @PostMapping
    public ResponseEntity<Client> createClient(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Client client) {
        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: POST /api/clients from Advisor ID: {}", advisorId);
        return ResponseEntity.ok(clientService.onboardClient(client, advisorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientDetails(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: GET /api/clients/{} from Advisor ID: {}", id, advisorId);
        return ResponseEntity.ok(clientService.getClientProfile(id, advisorId));
    }

    // UPDATE CLIENT: PUT /api/clients/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Client updatedClientData) {

        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: PUT /api/clients/{} from Advisor ID: {}", id, advisorId);

        Client updatedClient = clientService.updateClient(id, advisorId, updatedClientData);
        return ResponseEntity.ok(updatedClient);
    }
}