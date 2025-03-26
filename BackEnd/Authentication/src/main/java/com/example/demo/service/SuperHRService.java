package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.SuperHR;
import com.example.demo.repos.SuperHRRepository;

@Service
public class SuperHRService {

    @Autowired
    private SuperHRRepository superHRRepository;

    public SuperHR registerSuperHR(SuperHR superHR) {
        return superHRRepository.save(superHR);
    }
    public SuperHR authenticate(String email, String password) {
        SuperHR shr = superHRRepository.findByEmail(email);
        if (shr != null && shr.getPassword().equals(password)) {
            return shr;
        }
        return null;
    }
    public SuperHR getSuperHRByEmail(String email) {
    	return superHRRepository.findByEmail(email);
    }
}