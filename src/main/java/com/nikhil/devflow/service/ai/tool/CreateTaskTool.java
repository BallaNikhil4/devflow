package com.nikhil.devflow.service.ai.tool;

import org.springframework.stereotype.Component;

@Component
public class CreateTaskTool implements Tool {
    @Override
    public String getName() {
        return "CreateTaskTool";
    }

    @Override
    public String getDescription() {
        return "Creates a task. (Future approval required)";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        return "CreateTaskTool executed (Approval pending for write operations).";
    }
}
