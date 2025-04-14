package com.example.demo.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entities.HR;
import com.example.demo.repos.HRRepository;

@Service
public class HRService {

    @Autowired
    private HRRepository hrRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
  
    public HR registerHR(HR hr) {
    	hr.setEmail(hr.getEmail().toLowerCase());
    	hr.setPassword(passwordEncoder.encode(hr.getPassword()));
        return hrRepository.save(hr);
    }
    

    public String deleteHR(HR e) {
    	if(hrRepository.findByEmail(e.getEmail())==null)
    		return "HR Not Found";
    	else {
    		hrRepository.delete(e);
    		return "HR Deleted Successfully";
    	}    		
    }
    
    public HR getHRByEmail(String email) {
    	return hrRepository.findByEmail(email).orElse(null);
    }
    
    public List<HR> getAllHR(){
    	return hrRepository.findAll();
    }
    
    public HR getHrById(Long id) {
        return hrRepository.findById(id).orElse(null);
    }
}
