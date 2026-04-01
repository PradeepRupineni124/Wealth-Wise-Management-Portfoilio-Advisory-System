package com.Wealth.gateway;


import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    public static class Config {
        // Configuration fields if needed
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            log.info("[Auth] Checking credentials for path: {}", exchange.getRequest().getPath());

            if (!exchange.getRequest().getHeaders().containsHeader(HttpHeaders.AUTHORIZATION)) {
                log.warn("[Auth] Access Denied: Missing Authorization Header");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing Token");
            }

            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("[Auth] Access Denied: Invalid Token Format");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Token Format");
            }

            log.info("[Auth] Token found. Forwarding to internal service.");
            return chain.filter(exchange);
        };
    }
}
