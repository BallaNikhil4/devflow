package com.nikhil.devflow.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nikhil.devflow.entity.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {

}
