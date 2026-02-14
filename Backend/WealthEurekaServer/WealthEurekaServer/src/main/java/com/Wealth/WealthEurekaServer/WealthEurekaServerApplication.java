package com.Wealth.WealthEurekaServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;


@SpringBootApplication
@EnableEurekaServer
public class WealthEurekaServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WealthEurekaServerApplication.class, args);
	}

}
