package com.compoundinglife.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class McpModels {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class McpToolInfo {
        private String name;
        private String description;
        private Map<String, Object> inputSchema;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class McpCallRequest {
        private String toolName;
        private Map<String, Object> arguments;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class McpCallResponse {
        private String toolName;
        private Object result;
        private boolean success;
        private String errorMessage;
    }
}
