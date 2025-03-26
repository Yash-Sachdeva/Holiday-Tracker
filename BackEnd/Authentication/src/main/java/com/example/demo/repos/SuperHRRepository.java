package com.example.demo.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entities.SuperHR;

public interface SuperHRRepository extends JpaRepository<SuperHR,Long>{
	SuperHR findByEmail(String email);
}
