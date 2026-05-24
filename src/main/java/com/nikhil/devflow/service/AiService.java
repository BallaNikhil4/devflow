package com.nikhil.devflow.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiService {

    @SuppressWarnings("rawtypes")
    public String generateTasks(String idea) {

        String prompt = "You are a senior software architect helping break project ideas into development tasks. " +

                "Break the following software project idea into clear actionable development tasks. " +

                "For every task return exactly in this format:\n\n" +

                "Title: <short task title>\n" +
                "Description: <1-2 sentence explanation>\n" +
                "Priority: HIGH or MEDIUM or LOW\n\n" +

                "Rules:\n" +
                "- Keep title short and clear\n" +
                "- Description should explain what needs to be built\n" +
                "- Return only tasks\n" +
                "- Do not add introductions\n" +
                "- Do not add explanations outside task list\n\n" +

                "Project Idea: " + idea;

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> request = Map.of(
                "model", "mistral",
                "prompt", prompt,
                "stream", false);

        Map response = restTemplate.postForObject(
                "http://localhost:11434/api/generate",
                request,
                Map.class);

        return response.get("response").toString();
    }
}