package com.Wealth.Project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Wealth.Project.model.Advisor;

public interface AdvisoryRepository extends JpaRepository<Advisor,Long> {
	Optional<Advisor> findByEmail(String email);
}
