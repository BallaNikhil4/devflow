package com.nikhil.devflow.service;

import com.nikhil.devflow.service.ai.AgentOrchestrator;
import com.nikhil.devflow.service.ai.OllamaClient;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    
    private final AgentOrchestrator agentOrchestrator;
    private final OllamaClient ollamaClient;

    public AiService(AgentOrchestrator agentOrchestrator, OllamaClient ollamaClient) {
        this.agentOrchestrator = agentOrchestrator;
        this.ollamaClient = ollamaClient;
    }

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

        return ollamaClient.generate(prompt);
    }

    public String chat(Long projectId, String message) {
        return agentOrchestrator.processRequest(projectId, message);
    }

    public String suggestNextTask(Long projectId) {
        return agentOrchestrator.processRequest(projectId, "What should I build next?");
    }

    public String detectMissingTasks(Long projectId) {
        return agentOrchestrator.processRequest(projectId, "What are the missing tasks?");
    }

    public String breakDownTask(Long projectId, String taskTitle) {
        return agentOrchestrator.processRequest(projectId, "Break down this task", taskTitle);
    }
}