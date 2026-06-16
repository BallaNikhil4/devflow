package com.nikhil.devflow.service.ai.tool;

public interface Tool {
    String getName();
    String getDescription();
    String execute(Long projectId, Object... args);
}
