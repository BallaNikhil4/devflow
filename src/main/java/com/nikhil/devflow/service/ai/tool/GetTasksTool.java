package com.nikhil.devflow.service.ai.tool;

import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.TaskRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetTasksTool implements Tool {
    private final TaskRepository taskRepository;

    public GetTasksTool(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public String getName() {
        return "GetTasksTool";
    }

    @Override
    public String getDescription() {
        return "Returns all project tasks.";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) return "No tasks found.";
        
        StringBuilder sb = new StringBuilder("Tasks:\n");
        for (Task t : tasks) {
            sb.append("- ").append(t.getTitle()).append(" [").append(t.getStatus()).append("]\n");
        }
        return sb.toString();
    }
}
