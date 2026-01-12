package com.jemittor.auths.config;

import com.jemittor.auths.middlewares.JEmittorSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static com.jemittor.auths.utils.Commons.LOGOUT_ENDPOINT;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig  {
    private final JEmittorSuccessHandler successHandler;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http.authorizeHttpRequests(request -> request
                        .requestMatchers(LOGOUT_ENDPOINT)
                        .authenticated()
                        .anyRequest()
                        .authenticated())
                .oauth2Login(oauth2 -> oauth2.successHandler(successHandler))
                .logout(logout -> logout
                        .logoutUrl(LOGOUT_ENDPOINT)
                        .logoutSuccessUrl("/")
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true))
                .csrf(Customizer.withDefaults())
                .build();
    }
}
