package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Employee;
import com.example.demo.service.EmployeeService;


@RestController
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

   
    
    @GetMapping("/session")
    public ResponseEntity<String> checkSession() {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
    	Employee user=employeeService.getEmployeeByEmail(auth.getName());
    	if (user == null) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found");
    	}
    	return ResponseEntity.ok(user.getEmail());
    }
    
    @GetMapping("/profile")
    public ResponseEntity<Employee> getEmployeeProfile() {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
    	Employee employee = employeeService.getEmployeeByEmail(auth.getName());
    	
    	if (employee == null) {
    		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
    	}
    	
    	return ResponseEntity.ok(employee);
    }

}
