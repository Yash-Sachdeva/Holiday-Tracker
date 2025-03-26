package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.HR;

public interface HRRepository extends JpaRepository<HR, Long> {
    HR findByEmail(String email);
}