package com.nikhil.devflow.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nikhil.devflow.service.AiService;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate-tasks")
    public String generateTasks(
            @RequestBody Map<String, String> body) {

        String idea = body.get("idea");

        return aiService.generateTasks(idea);
    }

    @PostMapping("/chat")
    public String chat(@RequestBody Map<String, String> body) {
        Long projectId = Long.parseLong(body.get("projectId"));
        String message = body.get("message");
        return aiService.chat(projectId, message);
    }

    @PostMapping("/suggest-next")
    public String suggestNext(@RequestBody Map<String, String> body) {

        Long projectId = Long.parseLong(body.get("projectId"));

        return aiService.suggestNextTask(projectId);
    }

    @PostMapping("/detect-missing")
    public String detectMissing(@RequestBody Map<String, String> body) {
        Long projectId = Long.parseLong(body.get("projectId"));

        return aiService.detectMissingTasks(projectId);
    }

    @PostMapping("/break-down")
    public String breakDownTask(
            @RequestBody Map<String, String> body) {

        Long projectId = Long.parseLong(
                body.get("projectId"));

        String taskTitle = body.get("taskTitle");

        return aiService.breakDownTask(
                projectId,
                taskTitle);
    }
}