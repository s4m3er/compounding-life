package com.compoundinglife.controller;

import com.compoundinglife.model.McpModels.*;
import com.compoundinglife.service.McpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mcp")
public class McpController {

    private final McpService mcpService;

    public McpController(McpService mcpService) {
        this.mcpService = mcpService;
    }

    @GetMapping("/tools")
    public ResponseEntity<List<McpToolInfo>> listTools() {
        return ResponseEntity.ok(mcpService.listTools());
    }

    @PostMapping("/call")
    public ResponseEntity<McpCallResponse> callTool(@RequestBody McpCallRequest request) {
        return ResponseEntity.ok(mcpService.executeTool(request));
    }
}
