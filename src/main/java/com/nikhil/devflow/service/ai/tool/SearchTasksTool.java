package com.nikhil.devflow.service.ai.tool;

import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.TaskRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class SearchTasksTool implements Tool {
    private final TaskRepository taskRepository;

    public SearchTasksTool(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public String getName() {
        return "SearchTasksTool";
    }

    @Override
    public String getDescription() {
        return "Searches tasks by keyword.";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        if (args == null || args.length == 0 || args[0] == null) {
            return "No keyword provided for search.";
        }
        String keyword = args[0].toString().toLowerCase();
        
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<Task> matchedTasks = tasks.stream()
            .filter(t -> (t.getTitle() != null && t.getTitle().toLowerCase().contains(keyword)) ||
                         (t.getDescription() != null && t.getDescription().toLowerCase().contains(keyword)))
            .collect(Collectors.toList());
            
        if (matchedTasks.isEmpty()) return "No tasks matched the keyword: " + keyword;
        
        StringBuilder sb = new StringBuilder("Search Results:\n");
        for (Task t : matchedTasks) {
            sb.append("- ").append(t.getTitle()).append(" [").append(t.getStatus()).append("]\n");
        }
        return sb.toString();
    }
}
