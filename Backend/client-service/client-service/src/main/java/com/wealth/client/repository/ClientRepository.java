package com.wealth.client.repository;

import com.wealth.client.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;


public interface ClientRepository extends JpaRepository<Client,Long> {
    // Find all clients for a specific advisor
    List<Client> findByAdvisorId(Long advisorId);

    // Find specific client AND ensure they belong to the advisor
    Optional<Client> findByClientIdAndAdvisorId(Long clientId, Long advisorId);

    boolean existsByEmailAddress(String email);
}
