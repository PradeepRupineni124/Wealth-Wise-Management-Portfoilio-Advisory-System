package com.wealthwise.compliance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableFeignClients(basePackages = "com.wealthwise.compliance.client")
@EnableScheduling
public class ComplianceServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComplianceServiceApplication.class, args);
	}

}
