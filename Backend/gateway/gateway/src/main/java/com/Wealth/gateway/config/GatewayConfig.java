package com.Wealth.gateway.config;

import com.Wealth.gateway.JwtAuthenticationFilter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@Slf4j // 1. Enables 'log' variable
public class GatewayConfig {

    private final JwtAuthenticationFilter authFilter;

    public GatewayConfig(JwtAuthenticationFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth_route", r -> r.path("/auth/**")
                        .filters(f -> f
                                // Log specifically for this route (Optional, but helpful)
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Auth Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
//                                .rewritePath("/auth/(?<segment>.*)", "/${segment}")
                        )
                        .uri("lb://wealth-auth-service")) // Note: Use "lb://AUTH-SERVICE" if using Eureka
                .build();
    }

    // 2. GLOBAL LOGGING FILTER (Catches ALL requests)
    @Bean
    public GlobalFilter globalLoggingFilter() {
        return (exchange, chain) -> {
            // Pre-Filter: Log the Request
            log.info("GATEWAY REQ: ID={} Path={} Method={}",
                    exchange.getRequest().getId(),
                    exchange.getRequest().getPath(),
                    exchange.getRequest().getMethod());

            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                // Post-Filter: Log the Response (after downstream service returns)
                log.info("GATEWAY RES: ID={} Status={}",
                        exchange.getRequest().getId(),
                        exchange.getResponse().getStatusCode());
            }));
        };
    }

    @Bean
    public CorsWebFilter corsWebFilter() {
        log.info("Initializing CORS Configuration...");
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.addAllowedOrigin("http://localhost:4200");
        corsConfig.addAllowedMethod("*");
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);
        return new CorsWebFilter(source);
    }
}