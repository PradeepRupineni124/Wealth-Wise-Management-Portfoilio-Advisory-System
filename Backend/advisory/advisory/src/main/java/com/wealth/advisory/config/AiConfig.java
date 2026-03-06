package com.wealth.advisory.config;

import com.google.genai.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class AiConfig {

    @Bean
    public Client googleGenAiClient(Environment env) {
        // Forcefully grab the key directly from the environment
        String apiKey = env.getProperty("spring.ai.google.genai.api-key");

        // Add a safety check so we get a clear error if the YAML is typed wrong
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new IllegalStateException("CRITICAL ERROR: API Key was not found in application.yaml!");
        }

        // Build the client safely
        return Client.builder()
                .apiKey(apiKey)
                .build();
    }
}