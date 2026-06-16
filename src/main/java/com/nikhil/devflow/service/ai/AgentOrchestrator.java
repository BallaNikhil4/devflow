package com.nikhil.devflow.service.ai;

import com.nikhil.devflow.entity.ConversationMemory;
import com.nikhil.devflow.repository.ConversationMemoryRepository;
import com.nikhil.devflow.service.ai.tool.ToolRegistry;
import org.springframework.stereotype.Service;

@Service
public class AgentOrchestrator {
    private final IntentDetector intentDetector;
    private final ContextEngine contextEngine;
    private final ToolRegistry toolRegistry;
    private final OllamaClient ollamaClient;
    private final ConversationMemoryRepository conversationMemoryRepository;

    public AgentOrchestrator(IntentDetector intentDetector,
                             ContextEngine contextEngine,
                             ToolRegistry toolRegistry,
                             OllamaClient ollamaClient,
                             ConversationMemoryRepository conversationMemoryRepository) {
        this.intentDetector = intentDetector;
        this.contextEngine = contextEngine;
        this.toolRegistry = toolRegistry;
        this.ollamaClient = ollamaClient;
        this.conversationMemoryRepository = conversationMemoryRepository;
    }

    public String processRequest(Long projectId, String message, String... extraArgs) {
        // Detect Intent
        Intent intent = intentDetector.detectIntent(message);
        
        // Build Snapshot
        ProjectSnapshot snapshot = contextEngine.buildSnapshot(projectId);
        
        // Gather Tool Context
        StringBuilder toolContext = new StringBuilder();
        if (intent == Intent.NEXT_TASK) {
            toolContext.append(toolRegistry.getTool("GetTasksTool").execute(projectId));
        } else if (intent == Intent.PROJECT_HEALTH) {
            toolContext.append(toolRegistry.getTool("GetProjectHealthTool").execute(projectId));
        } else if (intent == Intent.SEARCH_TASK) {
            toolContext.append(toolRegistry.getTool("SearchTasksTool").execute(projectId, message));
        } else if (intent == Intent.GENERAL_CHAT) {
            toolContext.append(toolRegistry.getTool("GetProjectTool").execute(projectId));
        } else if (intent == Intent.BREAK_DOWN_TASK) {
            if (extraArgs != null && extraArgs.length > 0) {
                toolContext.append(toolRegistry.getTool("BreakDownTaskTool").execute(projectId, extraArgs[0]));
            }
        } else if (intent == Intent.MISSING_TASKS) {
            toolContext.append(toolRegistry.getTool("GetTasksTool").execute(projectId));
        }

        // Save User Message to Memory
        ConversationMemory userMem = new ConversationMemory();
        userMem.setProjectId(projectId);
        userMem.setRole("User");
        userMem.setContent(message);
        conversationMemoryRepository.save(userMem);

        // Build Prompt
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are DevFlow AI V2, an intelligent software development architect and technical lead.\n");
        prompt.append("Answer the user based ONLY on the provided context. Do not invent details.\n\n");
        
        if (snapshot != null) {
            prompt.append("--- PROJECT SNAPSHOT ---\n");
            prompt.append("Project: ").append(snapshot.getProjectName()).append("\n");
            prompt.append("Project Health: Todo=").append(snapshot.getTodoCount())
                  .append(", InProgress=").append(snapshot.getInProgressCount())
                  .append(", Done=").append(snapshot.getDoneCount()).append("\n\n");
            
            prompt.append("--- RECENT CONVERSATIONS ---\n");
            for (ConversationMemory mem : snapshot.getRecentConversations()) {
                prompt.append(mem.getRole()).append(": ").append(mem.getContent()).append("\n");
            }
            prompt.append("\n");
        }
        
        prompt.append("--- TOOL DATA ---\n");
        prompt.append(toolContext.toString()).append("\n\n");
        
        prompt.append("--- USER REQUEST ---\n");
        prompt.append(message).append("\n\n");
        
        prompt.append("--- INSTRUCTIONS ---\n");
        if (intent == Intent.BREAK_DOWN_TASK) {
             prompt.append("Return the answer as a numbered list of actionable subtasks in a logical implementation order.\n");
        } else if (intent == Intent.NEXT_TASK) {
             prompt.append("Return ONLY the single best next task based on logical dependencies. Format:\nTask: <next task>\nReason: <reason>\n");
        } else if (intent == Intent.MISSING_TASKS) {
             prompt.append("Return ONLY the missing tasks with a short explanation.\n");
        } else {
             prompt.append("Give a clear and concise answer.\n");
        }

        // Call Ollama
        String response = ollamaClient.generate(prompt.toString());

        // Save AI Response to Memory
        ConversationMemory aiMem = new ConversationMemory();
        aiMem.setProjectId(projectId);
        aiMem.setRole("AI");
        aiMem.setContent(response);
        conversationMemoryRepository.save(aiMem);

        return response;
    }
}
