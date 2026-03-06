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

@Configuration
@Slf4j // Enables 'log' variable
public class GatewayConfig {

    private final JwtAuthenticationFilter authFilter;

    // Inject your custom JWT filter
    public GatewayConfig(JwtAuthenticationFilter authFilter) {
        this.authFilter = authFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // 1. AUTH SERVICE ROUTE (No token required to log in or register)
                .route("auth_route", r -> r.path("/auth/**")
                        .filters(f -> f
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Auth Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
                        )
                        .uri("lb://wealth-auth-service"))

                // 2. CLIENT SERVICE ROUTE (Token REQUIRED)
                .route("client_service_route", r -> r.path("/api/clients/**")
                        .filters(f -> f
                                // Apply your JWT filter to ensure the Bearer token is present
                                .filter(authFilter.apply(new JwtAuthenticationFilter.Config()))
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Client Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
                        )
                        // Make sure "client-service" matches the spring.application.name in your Client Service properties
                        .uri("lb://client-service"))

                // 3. PORTFOLIO SERVICE ROUTE (Token REQUIRED)
                .route("portfolio_service_route", r -> r.path("/api/portfolio/**", "/api/holdings/**", "/api/assets/**")
                        .filters(f -> f
                                // Apply your JWT filter to ensure the Bearer token is present
                                .filter(authFilter.apply(new JwtAuthenticationFilter.Config()))
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Portfolio Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
                        )
                        // Make sure this exactly matches how Eureka registers your portfolio service
                        .uri("lb://portfolio-service"))
                // 4. COMPLIANCE SERVICE ROUTE
                .route("compliance_service_route", r -> r.path("/api/compliance/**")
                        .filters(f -> f
                                .filter(authFilter.apply(new JwtAuthenticationFilter.Config()))
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Compliance Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                }))
                        .uri("lb://compliance-service"))
                .route("overview_route", r -> r.path("/overview/**")
                        .filters(f -> f
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Overview Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
                        )
                        // Make sure OVERVIEW-SERVICE exactly matches the
                        // spring.application.name in your overview-service's application.yml
                        .uri("lb://overview-service"))
                .route("analytics_route", r -> r.path("/api/analytics/**")
                        .filters(f -> f
                                // Optional: You can add the authFilter here if this route needs JWT protection
                                // .filter(authFilter)
                                .filter((exchange, chain) -> {
                                    log.info("Routing request to Analytics Service: {}", exchange.getRequest().getURI());
                                    return chain.filter(exchange);
                                })
                        )
                        // IMPORTANT: Replace 'analytics-service' with the exact spring.application.name
                        // registered in your Eureka server for the analytics microservice.
                        .uri("lb://analytics-service"))
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

    // 3. CORS CONFIGURATION
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