package com.compoundinglife.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(GeminiAiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String modelName;

    @Value("${gemini.api.endpoint:https://generativelanguage.googleapis.com/v1beta/models}")
    private String endpoint;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT =
        "You are the 'Compounding Life' Rational AI Companion.\n" +
        "Your philosophy is anchored strictly in the timeless, boring, proven wisdom of:\n" +
        "1. Charlie Munger (Inversion, avoiding foolishness, mental models, extreme patience, signal vs noise)\n" +
        "2. Warren Buffett (Economic moats, long-term compounding, frugality, margin of safety, ignoring macro alarms)\n" +
        "3. Benjamin Graham (Mr. Market mood swings, intrinsic value)\n" +
        "4. Parag Parikh (Resisting behavioral biases, loss aversion, FOMO, herding behavior)\n" +
        "5. InvestYadnya (Pragmatic asset allocation, debt avoidance, pure term & health insurance)\n" +
        "6. Physical Longevity (7-8 hours sleep, 10,000 steps, whole home food, zero smoking, health defense).\n\n" +
        "Rules:\n" +
        "- NEVER recommend get-rich-quick schemes, F&O trading, crypto gambling, or speculative fads.\n" +
        "- Encourage boring consistency, automated SIPs, and high emergency funds.\n" +
        "- Emphasize that health and finance are the only two foundations of a long, free human life.\n" +
        "- When the user asks about geopolitics or scary news (e.g. oil shocks, wars, AI disruption, recessions), remind them that the world has survived countless crises and quality compounding businesses endure.\n" +
        "- Keep answers grounded, concise, empathetic, and practical.\n";

    public String generateResponse(String userMessage) {
        if (apiKey == null || apiKey.isBlank()) {
            return getPhilosophicalFallback(userMessage);
        }

        // Multi-Model Resilience: Fallback cascade if primary model hits 503 or high demand
        List<String> modelsToTry = List.of(
                modelName != null && !modelName.isBlank() ? modelName : "gemini-1.5-flash",
                "gemini-1.5-flash",
                "gemini-1.5-flash-8b",
                "gemini-1.5-pro"
        ).stream().distinct().toList();

        for (String candidateModel : modelsToTry) {
            try {
                String result = callGeminiModel(candidateModel, userMessage);
                if (result != null && !result.isBlank()) {
                    return result;
                }
            } catch (Exception e) {
                log.warn("[GeminiAiService] Model '{}' unavailable ({}), trying next candidate in cascade...", candidateModel, e.getMessage());
            }
        }

        log.warn("[GeminiAiService] All remote Gemini models currently experiencing high demand. Serving contextual rational wisdom.");
        return getPhilosophicalFallback(userMessage);
    }

    private String callGeminiModel(String model, String userMessage) throws Exception {
        String url = String.format("%s/%s:generateContent?key=%s", endpoint, model, apiKey);

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
        return null;
    }

    public String explainGeopolitics(String newsSnippet) {
        String prompt = "A user is anxious about this news headline or geopolitical event:\n\"" + newsSnippet + "\"\n\n" +
                "De-escalate the panic. Explain why long-term index investors and healthy individuals should ignore daily sensationalism, " +
                "citing historical precedent (Graham/Buffett/Munger mindset). Keep it to 3 short, calming, actionable paragraphs.";
        return generateResponse(prompt);
    }

    private String getPhilosophicalFallback(String userMessage) {
        return "### Rational Perspective (Mental Model: Signal vs. Noise)\n\n" +
                "**1. The 100-Year Precedent:**\n" +
                "Macroeconomic alarms—whether crude oil shocks, technology disruption fears, or geopolitical tensions—are perpetual features of modern civilization. Warren Buffett famously noted: *'In the 20th century, the United States endured two world wars, a great depression, flu epidemics, and oil shocks—yet the Dow rose from 66 to 11,497.'* Human ingenuity and high-return-on-equity businesses adapt and outcompound these fears over time.\n\n" +
                "**2. What You Can Actually Control:**\n" +
                "You cannot control global oil cartels, AI race narratives, or central bank interest rate meetings. You can 100% control your personal margin of safety:\n" +
                "- An untouchable 6–12 month liquid emergency fund.\n" +
                "- An uninterrupted, disciplined monthly SIP in broad-market index funds.\n" +
                "- Your physical longevity: 7–8 hours of restorative sleep, daily walking, and whole home-cooked nutrition.\n\n" +
                "**3. The Munger Inversion:**\n" +
                "Charlie Munger taught us to invert: Instead of asking *'How do I predict the next global shock?'*, ask *'What foolish behaviors guarantee ruin?'* Panic-selling equity SIPs, jumping into speculative fads out of FOMO, and neglecting sleep due to financial anxiety guarantee ruin. Turn off the 24/7 financial noise, stay boring, and let compounding do its quiet work.";
    }
}
