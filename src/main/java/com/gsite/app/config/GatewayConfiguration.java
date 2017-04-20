package com.gsite.app.config;

import com.datastax.driver.core.Session;
import com.gsite.app.gateway.accesscontrol.AccessControlFilter;
import com.gsite.app.gateway.ratelimiting.RateLimitingFilter;
import com.gsite.app.gateway.ratelimiting.RateLimitingRepository;
import com.gsite.app.gateway.responserewriting.SwaggerBasePathRewritingFilter;
import io.github.jhipster.config.JHipsterProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfiguration {

    @Configuration
    public static class SwaggerBasePathRewritingConfiguration {

        @Bean
        public SwaggerBasePathRewritingFilter swaggerBasePathRewritingFilter(){
            return new SwaggerBasePathRewritingFilter();
        }
    }

    @Configuration
    public static class AccessControlFilterConfiguration {

        @Bean
        public AccessControlFilter accessControlFilter(RouteLocator routeLocator, JHipsterProperties jHipsterProperties){
            return new AccessControlFilter(routeLocator, jHipsterProperties);
        }
    }

    @Configuration
    @ConditionalOnProperty("jhipster.gateway.rate-limiting.enabled")
    public static class RateLimitingConfiguration {

        private final JHipsterProperties jHipsterProperties;

        public RateLimitingConfiguration(JHipsterProperties jHipsterProperties) {
            this.jHipsterProperties = jHipsterProperties;
        }

        @Bean
        public RateLimitingRepository rateLimitingRepository(Session session) {
            return new RateLimitingRepository(session);
        }

        @Bean
        public RateLimitingFilter rateLimitingFilter(RateLimitingRepository rateLimitingRepository) {
            return new RateLimitingFilter(rateLimitingRepository, jHipsterProperties);
        }
    }
}
