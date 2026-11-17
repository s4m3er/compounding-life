package com.compoundinglife.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Value("${spring.application.name:compounding-life-backend}")
    private String appName;

    private final DataSource dataSource;

    public SystemController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping("/version")
    public ResponseEntity<Map<String, Object>> getSystemVersion() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("app", appName);
        info.put("backendVersion", "1.2.0");
        info.put("status", "UP");
        info.put("region", "asia-south1 (Mumbai)");
        info.put("timestamp", Instant.now().toString());

        try (Connection conn = dataSource.getConnection()) {
            String dbProduct = conn.getMetaData().getDatabaseProductName();
            info.put("database", dbProduct);
            info.put("databaseStatus", "CONNECTED");
        } catch (Exception e) {
            info.put("database", "OFFLINE");
            info.put("databaseStatus", "ERROR");
        }

        return ResponseEntity.ok(info);
    }
}
