package com.Wealth.Compliance.repository;

import com.Wealth.Compliance.model.ComplianceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplianceRuleRepository extends JpaRepository<ComplianceRule, Long> {
    
    Optional<ComplianceRule> findByRuleCode(String ruleCode);
    
    List<ComplianceRule> findByCategory(ComplianceRule.RuleCategory category);
    
    List<ComplianceRule> findBySeverity(ComplianceRule.RuleSeverity severity);
    
    List<ComplianceRule> findByIsActiveTrue();
    
    List<ComplianceRule> findByCategoryAndIsActiveTrue(ComplianceRule.RuleCategory category);
}
