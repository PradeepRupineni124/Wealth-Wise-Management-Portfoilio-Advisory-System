package com.wealth.client.service;

import com.wealth.client.model.Client;
import com.wealth.client.model.KycStatus;
import com.wealth.client.repository.ClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    // Define where files will be saved on the server
    private final String UPLOAD_DIR = "uploads/kyc-docs/";

    // UPDATED: Added MultipartFile parameter
    public Client onboardClient(Client client, Long loggedInAdvisorId, MultipartFile file) {
        log.info("Attempting to onboard client: {} for Advisor ID: {}", client.getFullName(), loggedInAdvisorId);

        if (clientRepository.existsByEmailAddress(client.getEmailAddress())) {
            log.error("Onboarding failed: Email {} already exists", client.getEmailAddress());
            throw new RuntimeException("Email already exists");
        }

        // File Upload Logic
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                client.setKycDocumentRef(filePath.toString());
                client.setKycStatus(KycStatus.PENDING);
                log.info("Saved KYC document at: {}", filePath.toString());

            } catch (Exception e) {
                log.error("Failed to store KYC document", e);
                throw new RuntimeException("Failed to store KYC document", e);
            }
        }

        client.setAdvisorId(loggedInAdvisorId);
        Client savedClient = clientRepository.save(client);

        log.info("Client onboarded successfully. New Client ID: {}", savedClient.getClientId());
        return savedClient;
    }

    public List<Client> getAllClients(Long loggedInAdvisorId) {
        log.debug("Fetching all clients for Advisor ID: {}", loggedInAdvisorId);
        return clientRepository.findByAdvisorId(loggedInAdvisorId);
    }

    public Client getClientProfile(Long clientId, Long loggedInAdvisorId) {
        log.debug("Fetching profile for Client ID: {} by Advisor ID: {}", clientId, loggedInAdvisorId);
        return clientRepository.findByClientIdAndAdvisorId(clientId, loggedInAdvisorId)
                .orElseThrow(() -> new RuntimeException("Client not found or Access Denied"));
    }

    public Client updateClient(Long clientId, Long loggedInAdvisorId, Client updatedData) {
        log.info("Attempting to update Client ID: {} for Advisor ID: {}", clientId, loggedInAdvisorId);
        Client existingClient = getClientProfile(clientId, loggedInAdvisorId);

        if (!existingClient.getEmailAddress().equals(updatedData.getEmailAddress())) {
            if (clientRepository.existsByEmailAddress(updatedData.getEmailAddress())) {
                throw new RuntimeException("Email already exists");
            }
            existingClient.setEmailAddress(updatedData.getEmailAddress());
        }

        existingClient.setFullName(updatedData.getFullName());
        existingClient.setPhoneNumber(updatedData.getPhoneNumber());
        existingClient.setDateOfBirth(updatedData.getDateOfBirth());
        existingClient.setAddress(updatedData.getAddress());
        existingClient.setOccupation(updatedData.getOccupation());
        existingClient.setEmployer(updatedData.getEmployer());
        existingClient.setRiskProfile(updatedData.getRiskProfile());
        existingClient.setInvestmentGoal(updatedData.getInvestmentGoal());
        existingClient.setInvestmentHorizon(updatedData.getInvestmentHorizon());
        existingClient.setLiquidityNeeds(updatedData.getLiquidityNeeds());

        return clientRepository.save(existingClient);
    }

    // --- PASTE THIS AT THE BOTTOM OF ClientService.java ---

    public Client updateKycDocument(Long clientId, Long loggedInAdvisorId, MultipartFile file) {
        log.info("Attempting to upload KYC document for Client ID: {} by Advisor ID: {}", clientId, loggedInAdvisorId);

        // 1. Fetch the existing client (This automatically verifies the advisor owns them)
        Client existingClient = getClientProfile(clientId, loggedInAdvisorId);

        // 2. Handle the file upload securely
        if (file != null && !file.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
                String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

                Path filePath = uploadPath.resolve(uniqueFileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // 3. Update the client's KYC record
                existingClient.setKycDocumentRef(filePath.toString());
                existingClient.setKycStatus(KycStatus.PENDING); // Status changes to Pending upon upload

                log.info("Successfully saved new KYC document at: {}", filePath.toString());

            } catch (Exception e) {
                log.error("Failed to store KYC document for Client ID: {}", clientId, e);
                throw new RuntimeException("Failed to store KYC document", e);
            }
        } else {
            throw new IllegalArgumentException("Cannot upload an empty file.");
        }

        // 4. Save the updated client back to the database
        return clientRepository.save(existingClient);
    }

    // --- ADD THIS TO THE BOTTOM OF ClientService.java ---

    public Client updateKycStatus(Long clientId, Long loggedInAdvisorId, KycStatus status) {
        log.info("Updating KYC status for Client ID: {} to {}", clientId, status);

        // Fetch the client (this automatically ensures the advisor owns this client)
        Client existingClient = getClientProfile(clientId, loggedInAdvisorId);

        // Update just the status
        existingClient.setKycStatus(status);

        // Save it back to MySQL
        return clientRepository.save(existingClient);
    }
}