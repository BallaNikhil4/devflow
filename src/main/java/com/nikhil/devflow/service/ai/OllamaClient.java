package com.nikhil.devflow.service.ai;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class OllamaClient {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String endPoint = "http://localhost:11434/api/generate";

    @SuppressWarnings("unchecked")
    public String generate(String prompt) {
        Map<String, Object> request = Map.of(
                "model", "mistral",
                "prompt", prompt,
                "stream", false);
        try {
            Map<String, Object> response = restTemplate.postForObject(endPoint, request, Map.class);
            if (response == null || response.get("response") == null) {
                return "Failed to get AI response";
            }
            return response.get("response").toString();
        } catch (Exception e) {
            return "Error calling Ollama: " + e.getMessage();
        }
    }
}
