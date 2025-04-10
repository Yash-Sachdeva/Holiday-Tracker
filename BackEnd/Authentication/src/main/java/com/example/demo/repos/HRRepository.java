package com.example.demo.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.HR;

public interface HRRepository extends JpaRepository<HR, Long> {
    HR findByEmail(String email);
    Optional<HR> findById(Long id);
}