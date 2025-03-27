package com.example.demo.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.HR;
import com.example.demo.repos.HRRepository;

@Service
public class HRService {

    @Autowired
    private HRRepository hrRepository;

    public HR registerHR(HR hr) {
    	hr.setEmail(hr.getEmail().toLowerCase());
        return hrRepository.save(hr);
    }
    public HR authenticate(String email, String password) {
        HR hr = hrRepository.findByEmail(email);
        if (hr != null && hr.getPassword().equals(password)) {
            return hr;
        }
        return null;
    }
    
    public HR getHRByEmail(String email) {
    	return hrRepository.findByEmail(email);
    }
    
    public List<HR> getAllHR(){
    	return hrRepository.findAll();
    }
    
}
