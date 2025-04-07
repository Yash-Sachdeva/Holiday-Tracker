package com.example.demo.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Client;

public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findById(Long id);
}

