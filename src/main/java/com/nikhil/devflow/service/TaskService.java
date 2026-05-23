package com.nikhil.devflow.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.TaskRepository;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long taskId, String status) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setStatus(status);
            return taskRepository.save(task);
        }
        return null;
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    public Task updateTask(Long task_id, Task updatedTask) {
        Optional<Task> optionalTask = taskRepository.findById(task_id);
        if (optionalTask.isPresent()) {
            Task exisitingtask = optionalTask.get();
            exisitingtask.setTitle(updatedTask.getTitle());
            exisitingtask.setDescription(updatedTask.getDescription());
            exisitingtask.setPriority(updatedTask.getPriority());
            return taskRepository.save(exisitingtask);
        }
        return null;
    }
}
