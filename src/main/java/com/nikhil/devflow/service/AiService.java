package com.nikhil.devflow.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.nikhil.devflow.entity.Project;
import com.nikhil.devflow.entity.Task;
import com.nikhil.devflow.repository.ProjectRepository;
import com.nikhil.devflow.repository.TaskRepository;

@Service
public class AiService {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    TaskRepository taskRepository;

    @SuppressWarnings("unchecked")
    public String callOllama(String endPoint, String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> request = Map.of(
                "model", "mistral",
                "prompt", prompt,
                "stream", false);
        Map<String, Object> response = restTemplate.postForObject(
                endPoint,
                request,
                Map.class);
        if (response == null || response.get("response") == null) {
            return "Failed to get AI response";
        }
        return response.get("response").toString();
    }

    public String buildProjectContext(Long projectId) {

        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (!optionalProject.isPresent()) {
            return "Project not found";
        }

        Project project = optionalProject.get();

        List<Task> tasks = taskRepository.findByProjectId(projectId);

        StringBuilder sb = new StringBuilder();

        sb.append("Project Name:\n");
        sb.append(project.getName());
        sb.append("\n\n");

        sb.append("Project Description:\n");
        sb.append(
                project.getDescription() == null
                        ? "No description"
                        : project.getDescription());

        sb.append("\n\n");

        sb.append("Current Board:\n\n");

        sb.append("TODO:\n");
        for (Task task : tasks) {
            if (task.getStatus().equals("TODO")) {
                sb.append("- ");
                sb.append(task.getTitle());
                sb.append("\n");
            }
        }

        sb.append("\nIN_PROGRESS:\n");
        for (Task task : tasks) {
            if (task.getStatus().equals("IN_PROGRESS")) {
                sb.append("- ");
                sb.append(task.getTitle());
                sb.append("\n");
            }
        }

        sb.append("\nDONE:\n");
        for (Task task : tasks) {
            if (task.getStatus().equals("DONE")) {
                sb.append("- ");
                sb.append(task.getTitle());
                sb.append("\n");
            }
        }

        return sb.toString();
    }

    public String generateTasks(String idea) {
        String prompt = "You are a senior software architect helping break project ideas into development tasks. "
                +

                "Break the following software project idea into clear actionable development tasks. " +

                "For every task return exactly in this format:\n\n" +

                "Title: <short task title>\n" +
                "Description: <1-2 sentence explanation>\n" +
                "Priority: HIGH or MEDIUM or LOW\n\n" +

                "Rules:\n" +
                "- Keep title short and clear\n" +
                "- Description should explain what needs to be built\n" +
                "- Return only tasks\n" +
                "- Do not add introductions\n" +
                "- Do not add explanations outside task list\n\n" +

                "Project Idea: " + idea;

        return callOllama("http://localhost:11434/api/generate", prompt);
    }

    public String chat(Long projectId, String message) {
        String context = buildProjectContext(projectId);
        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "You are DevFlow AI, an intelligent software development assistant.\n\n");

        prompt.append(
                "Your job is to help developers plan, organize and improve their projects.\n\n");
        prompt.append(
                "Always use the current project context and current board while answering. ");
        prompt.append(
                "Do not ignore the existing tasks.\n\n");
        prompt.append("Current Project:\n\n");
        prompt.append(context);
        prompt.append("\n");

        prompt.append("User Question:\n");
        prompt.append(message);

        prompt.append("\n\n");
        prompt.append("Give a clear and concise answer.");

        String endpoint = "http://localhost:11434/api/generate";
        return callOllama(endpoint, prompt.toString());
    }

    public String suggestNextTask(Long projectId) {

        String context = buildProjectContext(projectId);

        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "You are DevFlow AI, an intelligent software development assistant.\n\n");

        prompt.append(
                "Analyze the current project board and suggest ONLY the single best next task.\n");

        prompt.append(
                "Consider completed tasks, tasks in progress and logical dependencies.\n\n");

        prompt.append("Current Project:\n\n");

        prompt.append(context);

        prompt.append("\n");

        prompt.append(
                "Return your answer in this format:\n\n");

        prompt.append(
                "Task: <next task>\n");

        prompt.append(
                "Reason: <why this should be done next>");

        return callOllama(
                "http://localhost:11434/api/generate",
                prompt.toString());
    }

    public String detectMissingTasks(Long projectId) {

        String context = buildProjectContext(projectId);

        StringBuilder prompt = new StringBuilder();

        prompt.append(
                "You are DevFlow AI, an intelligent software development assistant.\n\n");

        prompt.append(
                "Analyze the current project board and identify important missing tasks.\n");

        prompt.append(
                "Do not repeat tasks that already exist.\n");

        prompt.append(
                "Think like a senior software architect.\n\n");

        prompt.append("Current Project:\n\n");

        prompt.append(context);

        prompt.append("\n");

        prompt.append(
                "Return only the missing tasks with a short explanation.");

        return callOllama(
                "http://localhost:11434/api/generate",
                prompt.toString());
    }
}