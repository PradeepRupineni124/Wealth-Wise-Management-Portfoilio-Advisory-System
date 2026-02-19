package com.wealth.client.service;

import com.wealth.client.model.Client;
import com.wealth.client.repository.ClientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Slf4j
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Client onboardClient(Client client, Long loggedInAdvisorId) {
        log.info("Attempting to onboard client: {} for Advisor ID: {}", client.getFullName(), loggedInAdvisorId);

        if (clientRepository.existsByEmailAddress(client.getEmailAddress())) {
            log.error("Onboarding failed: Email {} already exists", client.getEmailAddress());
            throw new RuntimeException("Email already exists");
        }

        client.setAdvisorId(loggedInAdvisorId);
        Client savedClient = clientRepository.save(client);

        log.info("Client onboarded successfully. New Client ID: {}", savedClient.getClientId());
        return savedClient;
    }

    public List<Client> getAllClients(Long loggedInAdvisorId) {
        log.debug("Fetching all clients for Advisor ID: {}", loggedInAdvisorId);
        List<Client> clients = clientRepository.findByAdvisorId(loggedInAdvisorId);
        log.info("Found {} clients for Advisor ID: {}", clients.size(), loggedInAdvisorId);
        return clients;
    }

    public Client getClientProfile(Long clientId, Long loggedInAdvisorId) {
        log.debug("Fetching profile for Client ID: {} by Advisor ID: {}", clientId, loggedInAdvisorId);

        return clientRepository.findByClientIdAndAdvisorId(clientId, loggedInAdvisorId)
                .orElseThrow(() -> {
                    log.error("Access Denied or Not Found: Advisor {} tried to access Client {}", loggedInAdvisorId, clientId);
                    return new RuntimeException("Client not found or Access Denied");
                });
    }

    // UPDATE: Modify existing client details
    public Client updateClient(Long clientId, Long loggedInAdvisorId, Client updatedData) {
        log.info("Attempting to update Client ID: {} for Advisor ID: {}", clientId, loggedInAdvisorId);

        // 1. Fetch the existing client (This also securely verifies ownership)
        Client existingClient = getClientProfile(clientId, loggedInAdvisorId);

        // 2. Check if they are trying to change the email, and if it's already taken
        if (!existingClient.getEmailAddress().equals(updatedData.getEmailAddress())) {
            if (clientRepository.existsByEmailAddress(updatedData.getEmailAddress())) {
                log.error("Update failed: Email {} is already in use", updatedData.getEmailAddress());
                throw new RuntimeException("Email already exists");
            }
            existingClient.setEmailAddress(updatedData.getEmailAddress());
        }

        // 3. Update the allowed fields (Notice we do NOT update clientId, advisorId, or createdDate)
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

        // 4. Save and return the updated entity
        Client savedClient = clientRepository.save(existingClient);
        log.info("Successfully updated Client ID: {}", savedClient.getClientId());

        return savedClient;
    }
}