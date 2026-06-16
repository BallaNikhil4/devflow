package com.nikhil.devflow.service.ai.tool;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ToolRegistry {
    private final Map<String, Tool> tools = new HashMap<>();

    public ToolRegistry(List<Tool> toolList) {
        for (Tool tool : toolList) {
            tools.put(tool.getName(), tool);
        }
    }

    public Tool getTool(String name) {
        return tools.get(name);
    }
    
    public Map<String, Tool> getAllTools() {
        return tools;
    }
}
