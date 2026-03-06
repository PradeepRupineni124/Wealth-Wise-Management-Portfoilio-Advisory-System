package com.wealth.advisory;

import com.google.genai.Client;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;

@EnableFeignClients
@SpringBootApplication
public class AdvisoryApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdvisoryApplication.class, args);
    }


}