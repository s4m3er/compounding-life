package com.compoundinglife.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-flash-lite-latest}")
    private String modelName;

    @Value("${gemini.api.endpoint:https://generativelanguage.googleapis.com/v1beta/models}")
    private String endpoint;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = 
        "You are the 'Compounding Life' AI Companion.\n" +
        "Your philosophy is anchored strictly in the timeless, boring, proven wisdom of:\n" +
        "1. Charlie Munger (Inversion, avoiding foolishness, mental models, patience)\n" +
        "2. Warren Buffett (Economic moats, long-term compounding, frugality, margin of safety)\n" +
        "3. Benjamin Graham (Mr. Market mood swings, intrinsic value)\n" +
        "4. Parag Parikh (Resisting behavioral bias, loss aversion, FOMO)\n" +
        "5. InvestYadnya (Pragmatic asset allocation, debt avoidance, pure insurance)\n" +
        "6. Physical Longevity (7-8 hours sleep, 10k steps, whole food, zero smoking, health insurance).\n\n" +
        "Rules:\n" +
        "- NEVER recommend get-rich-quick schemes, F&O trading, crypto gambling, or speculative fads.\n" +
        "- Encourage boring consistency, automated SIPs, and high emergency funds.\n" +
        "- Emphasize that health and finance are the only two foundations of a long, free human life.\n" +
        "- When the user asks about geopolitics or scary news, remind them that the world has survived countless crises and quality compounding businesses endure.\n" +
        "- Keep answers grounded, concise, empathetic, and practical.\n";

    public String generateResponse(String userMessage) {
        if (apiKey == null || apiKey.isBlank()) {
            return "Charlie Munger rule: The big money is not in buying and selling, but in waiting. Stick to your emergency buffer, sleep 7-8 hours, and let your automated SIP do the work.";
        }
        try {
            String url = String.format("%s/%s:generateContent?key=%s", endpoint, modelName, apiKey);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> systemInstruction = Map.of(
                    "parts", List.of(Map.of("text", SYSTEM_PROMPT))
            );

            Map<String, Object> contentPart = Map.of("text", userMessage);
            Map<String, Object> content = Map.of("parts", List.of(contentPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("system_instruction", systemInstruction);
            requestBody.put("contents", List.of(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    return textNode.asText();
                }
            }
            return "Patience and compounding are at the core of peace of mind. Stay focused on boring basics.";
        } catch (Exception e) {
            return "Remember Charlie Munger's wisdom: The big money is not in buying and selling, but in waiting. Stick to your boring habits and emergency fund shield. (AI Service note: " + e.getMessage() + ")";
        }
    }

    public String explainGeopolitics(String newsSnippet) {
        String prompt = "A user is anxious about this news headline or geopolitical event:\n\"" + newsSnippet + "\"\n\n" +
                "De-escalate the panic. Explain why long-term index investors and healthy individuals should ignore daily sensationalism, " +
                "citing historical precedent (Graham/Buffett/Munger mindset). Keep it to 3 short paragraphs.";
        return generateResponse(prompt);
    }
}
