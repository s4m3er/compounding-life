package com.compoundinglife.controller;

import com.compoundinglife.service.GeminiAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final GeminiAiService aiService;

    public AiController(GeminiAiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "");
        String reply = aiService.generateResponse(message);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @PostMapping("/explain-news")
    public ResponseEntity<Map<String, String>> explainNews(@RequestBody Map<String, String> request) {
        String headline = request.getOrDefault("news", "");
        String explanation = aiService.explainGeopolitics(headline);
        return ResponseEntity.ok(Map.of("explanation", explanation));
    }
}
