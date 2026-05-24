package com.nikhil.devflow.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nikhil.devflow.entity.Project;
import com.nikhil.devflow.repository.ProjectRepository;

@Service
public class ProjectService {
    @Autowired
    private ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    public Project updateProject(Long projectId, Project updatedProject) {

        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (optionalProject.isPresent()) {

            Project existingProject = optionalProject.get();

            existingProject.setName(updatedProject.getName());
            existingProject.setDescription(updatedProject.getDescription());

            return projectRepository.save(existingProject);
        }

        return null;
    }
}
