package com.nikhil.devflow.service.ai.tool;

import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.TaskRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetProjectHealthTool implements Tool {
    private final TaskRepository taskRepository;

    public GetProjectHealthTool(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public String getName() {
        return "GetProjectHealthTool";
    }

    @Override
    public String getDescription() {
        return "Returns project health statistics (completion %, active tasks, etc).";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        if (tasks.isEmpty()) return "No tasks in the project to calculate health.";
        
        long totalTasks = tasks.size();
        long completedTasks = tasks.stream().filter(t -> "DONE".equals(t.getStatus())).count();
        long activeTasks = tasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count();
        long pendingTasks = tasks.stream().filter(t -> "TODO".equals(t.getStatus())).count();
        
        double completionPercentage = (double) completedTasks / totalTasks * 100;
        
        return String.format(
            "Project Health:\n- Total Tasks: %d\n- Completed Tasks: %d\n- Active Tasks: %d\n- Pending Tasks: %d\n- Completion: %.2f%%\n",
            totalTasks, completedTasks, activeTasks, pendingTasks, completionPercentage
        );
    }
}
