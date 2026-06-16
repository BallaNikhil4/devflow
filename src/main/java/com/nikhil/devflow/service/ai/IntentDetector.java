package com.nikhil.devflow.service.ai;

import org.springframework.stereotype.Component;

@Component
public class IntentDetector {
    public Intent detectIntent(String message) {
        if (message == null) return Intent.GENERAL_CHAT;
        String lower = message.toLowerCase();
        
        if (lower.contains("next task") || lower.contains("suggest next") || lower.contains("what should i build next")) {
            return Intent.NEXT_TASK;
        }
        if (lower.contains("health") || lower.contains("status")) {
            return Intent.PROJECT_HEALTH;
        }
        if (lower.contains("search") || lower.contains("find")) {
            return Intent.SEARCH_TASK;
        }
        if (lower.contains("break down") || lower.contains("break")) {
            return Intent.BREAK_DOWN_TASK;
        }
        if (lower.contains("missing")) {
            return Intent.MISSING_TASKS;
        }
        return Intent.GENERAL_CHAT;
    }
}
