package com.nikhil.devflow.repository;

import com.nikhil.devflow.entity.ConversationMemory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationMemoryRepository extends JpaRepository<ConversationMemory, Long> {
    List<ConversationMemory> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
