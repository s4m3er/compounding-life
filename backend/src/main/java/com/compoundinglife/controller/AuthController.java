package com.compoundinglife.controller;

import com.compoundinglife.entity.User;
import com.compoundinglife.model.AuthModels.*;
import com.compoundinglife.repository.UserRepository;
import com.compoundinglife.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public AuthController(AuthenticationManager authenticationManager,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          JwtTokenProvider tokenProvider,
                          ObjectMapper objectMapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getFullName() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email, password, and full name are required"));
        }

        String normalizedEmail = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(normalizedEmail)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is already registered. Please sign in."));
        }

        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .role("ROLE_USER")
                .provider("LOCAL")
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateTokenFromUsername(user.getEmail());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = tokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                    .orElseThrow();

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .picture(user.getPicture())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody GoogleAuthRequest request) {
        if (request.getCredential() == null || request.getCredential().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Google ID token credential is required"));
        }

        try {
            // Verify Google token via Google's tokeninfo endpoint
            HttpRequest verifyRequest = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getCredential()))
                    .timeout(Duration.ofSeconds(6))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(verifyRequest, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("[GoogleAuth] Token verification failed with status: {}", response.statusCode());
                return ResponseEntity.status(401).body(Map.of("error", "Invalid Google authentication token"));
            }

            JsonNode payload = objectMapper.readTree(response.body());

            String email = payload.has("email") ? payload.get("email").asText().toLowerCase().trim() : null;
            boolean emailVerified = payload.has("email_verified") && Boolean.parseBoolean(payload.get("email_verified").asText());

            if (email == null || !emailVerified) {
                return ResponseEntity.status(400).body(Map.of("error", "Google account email is not verified"));
            }

            String fullName = payload.has("name") ? payload.get("name").asText() : email.split("@")[0];
            String picture = payload.has("picture") ? payload.get("picture").asText() : null;

            // Find existing user or register new Google user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                log.info("[GoogleAuth] Registering new Google user: {}", email);
                return userRepository.save(User.builder()
                        .email(email)
                        .fullName(fullName)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString())) // secure random placeholder
                        .role("ROLE_USER")
                        .provider("GOOGLE")
                        .picture(picture)
                        .build());
            });

            // Update profile picture or name if changed
            if (picture != null && !picture.equals(user.getPicture())) {
                user.setPicture(picture);
                userRepository.save(user);
            }

            String token = tokenProvider.generateTokenFromUsername(user.getEmail());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .picture(user.getPicture())
                    .build());

        } catch (Exception e) {
            log.error("[GoogleAuth] Error during Google authentication: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to authenticate with Google: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build());
    }
}
