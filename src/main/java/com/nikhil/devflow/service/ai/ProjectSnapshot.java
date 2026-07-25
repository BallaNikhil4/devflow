package com.nikhil.devflow.service.ai;

import com.nikhil.devflow.entity.ConversationMemory;
import com.nikhil.devflow.entity.Task;

import java.util.List;

public class ProjectSnapshot {
    private String projectName;
    private String projectDescription;
    private long totalTasks;
    private long completedTasks;
    private long activeTasks;
    private long pendingTasks;
    private long todoCount;
    private long inProgressCount;
    private long doneCount;
    private List<Task> recentTasks;
    private List<ConversationMemory> recentConversations;

    // Getters and setters
    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getProjectDescription() { return projectDescription; }
    public void setProjectDescription(String projectDescription) { this.projectDescription = projectDescription; }

    public long getTotalTasks() { return totalTasks; }
    public void setTotalTasks(long totalTasks) { this.totalTasks = totalTasks; }

    public long getCompletedTasks() { return completedTasks; }
    public void setCompletedTasks(long completedTasks) { this.completedTasks = completedTasks; }

    public long getActiveTasks() { return activeTasks; }
    public void setActiveTasks(long activeTasks) { this.activeTasks = activeTasks; }

    public long getPendingTasks() { return pendingTasks; }
    public void setPendingTasks(long pendingTasks) { this.pendingTasks = pendingTasks; }

    public long getTodoCount() { return todoCount; }
    public void setTodoCount(long todoCount) { this.todoCount = todoCount; }

    public long getInProgressCount() { return inProgressCount; }
    public void setInProgressCount(long inProgressCount) { this.inProgressCount = inProgressCount; }

    public long getDoneCount() { return doneCount; }
    public void setDoneCount(long doneCount) { this.doneCount = doneCount; }

    public List<Task> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<Task> recentTasks) { this.recentTasks = recentTasks; }

    public List<ConversationMemory> getRecentConversations() { return recentConversations; }
    public void setRecentConversations(List<ConversationMemory> recentConversations) { this.recentConversations = recentConversations; }
}
