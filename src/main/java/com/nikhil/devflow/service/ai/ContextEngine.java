package com.nikhil.devflow.service.ai;

import com.nikhil.devflow.entity.ConversationMemory;
import com.nikhil.devflow.entity.Project;
import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.ConversationMemoryRepository;
import com.nikhil.devflow.repository.ProjectRepository;
import com.nikhil.devflow.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContextEngine {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final ConversationMemoryRepository conversationMemoryRepository;

    public ContextEngine(ProjectRepository projectRepository,
                         TaskRepository taskRepository,
                         ConversationMemoryRepository conversationMemoryRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.conversationMemoryRepository = conversationMemoryRepository;
    }

    public ProjectSnapshot buildSnapshot(Long projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return null;

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        List<ConversationMemory> memories = conversationMemoryRepository.findByProjectIdOrderByCreatedAtAsc(projectId);

        ProjectSnapshot snapshot = new ProjectSnapshot();
        snapshot.setProjectName(project.getName());
        snapshot.setProjectDescription(project.getDescription());

        snapshot.setTotalTasks(tasks.size());
        snapshot.setCompletedTasks(tasks.stream().filter(t -> "DONE".equals(t.getStatus())).count());
        snapshot.setActiveTasks(tasks.stream().filter(t -> "IN_PROGRESS".equals(t.getStatus())).count());
        snapshot.setPendingTasks(tasks.stream().filter(t -> "TODO".equals(t.getStatus())).count());

        snapshot.setTodoCount(snapshot.getPendingTasks());
        snapshot.setInProgressCount(snapshot.getActiveTasks());
        snapshot.setDoneCount(snapshot.getCompletedTasks());

        // For recent, just taking all for now as project size is small
        snapshot.setRecentTasks(tasks);
        
        // Take last 10 messages
        int start = Math.max(0, memories.size() - 10);
        snapshot.setRecentConversations(memories.subList(start, memories.size()));

        return snapshot;
    }
}
