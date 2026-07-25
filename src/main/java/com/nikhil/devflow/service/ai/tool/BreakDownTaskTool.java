package com.nikhil.devflow.service.ai.tool;

import org.springframework.stereotype.Component;

@Component
public class BreakDownTaskTool implements Tool {

    @Override
    public String getName() {
        return "BreakDownTaskTool";
    }

    @Override
    public String getDescription() {
        return "Provides context for breaking down a task.";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        if (args != null && args.length > 0) {
            return "Task to Break Down: " + args[0].toString();
        }
        return "No task provided for breakdown.";
    }
}
