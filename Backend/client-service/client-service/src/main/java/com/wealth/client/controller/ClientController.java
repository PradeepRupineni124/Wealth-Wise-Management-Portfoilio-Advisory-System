package com.wealth.client.controller;

import com.wealth.client.model.Client;
import com.wealth.client.model.KycStatus;
import com.wealth.client.service.ClientService;
import com.wealth.client.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
// --- ADD THIS TO CLIENT CONTROLLER ---
import java.nio.file.Files; // Make sure this is imported

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
@Slf4j
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getAdvisorId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Unauthorized Access Attempt: Missing or invalid Authorization header");
            throw new RuntimeException("Unauthorized: Missing Token");
        }
        return jwtUtil.extractAdvisorId(authHeader);
    }

    @GetMapping
    public ResponseEntity<List<Client>> getMyClients(@RequestHeader("Authorization") String authHeader) {
        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: GET /api/clients from Advisor ID: {}", advisorId);
        return ResponseEntity.ok(clientService.getAllClients(advisorId));
    }

    // UPDATED: Now consumes MULTIPART_FORM_DATA and uses @RequestPart
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Client> createClient(
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("client") Client client,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: POST /api/clients from Advisor ID: {}", advisorId);

        return ResponseEntity.ok(clientService.onboardClient(client, advisorId, file));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientDetails(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: GET /api/clients/{} from Advisor ID: {}", id, advisorId);
        return ResponseEntity.ok(clientService.getClientProfile(id, advisorId));
    }

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

    // --- PASTE THIS AT THE BOTTOM OF ClientController.java ---

    @PostMapping(value = "/{id}/kyc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Client> uploadKycDocument(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestPart("file") MultipartFile file) {

        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: POST /api/clients/{}/kyc from Advisor ID: {}", id, advisorId);

        return ResponseEntity.ok(clientService.updateKycDocument(id, advisorId, file));
    }

    @GetMapping("/{id}/kyc-document")
    public ResponseEntity<Resource> getKycDocument(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {

        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: GET /api/clients/{}/kyc-document from Advisor ID: {}", id, advisorId);

        Client client = clientService.getClientProfile(id, advisorId);

        if (client.getKycDocumentRef() == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            Path filePath = Paths.get(client.getKycDocumentRef()).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                // 1. DYNAMICALLY DETECT THE FILE TYPE
                String contentType = Files.probeContentType(filePath);

                // Fallback just in case Java can't figure it out
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                // 2. SEND THE SPECIFIC CONTENT TYPE TO ANGULAR
                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("File not found on server");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error reading file", e);
        }
    }

    // --- ADD THIS TO THE BOTTOM OF ClientController.java ---

    @PutMapping("/{id}/kyc-status")
    public ResponseEntity<Client> updateKycStatus(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader,
            @RequestParam KycStatus status) {

        Long advisorId = getAdvisorId(authHeader);
        log.info("API Request: PUT /api/clients/{}/kyc-status", id);

        return ResponseEntity.ok(clientService.updateKycStatus(id, advisorId, status));
    }
}