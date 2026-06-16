package com.nikhil.devflow.service.ai.tool;

import com.nikhil.devflow.entity.Project;
import com.nikhil.devflow.repository.ProjectRepository;
import org.springframework.stereotype.Component;

@Component
public class GetProjectTool implements Tool {
    private final ProjectRepository projectRepository;

    public GetProjectTool(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public String getName() {
        return "GetProjectTool";
    }

    @Override
    public String getDescription() {
        return "Returns project information.";
    }

    @Override
    public String execute(Long projectId, Object... args) {
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) return "Project not found.";
        
        return "Project Name: " + project.getName() + "\n" +
               "Description: " + (project.getDescription() != null ? project.getDescription() : "None") + "\n";
    }
}
