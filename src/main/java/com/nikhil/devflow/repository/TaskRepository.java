package com.nikhil.devflow.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.nikhil.devflow.entity.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectId(Long projectId);

}
