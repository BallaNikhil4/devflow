package com.nikhil.devflow.service.ai.tool;

import org.springframework.stereotype.Component;

@Component
public class MoveTaskStatusTool implements Tool {
    @Override
    public String getName() {
        return "MoveTaskStatusTool";
    }

    @Override
    public String getDescription() {
        return "Moves tasks across board columns. (Future approval required)";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        return "MoveTaskStatusTool executed (Approval pending for write operations).";
    }
}
