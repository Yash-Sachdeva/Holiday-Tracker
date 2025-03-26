package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginDTO;
import com.example.demo.entities.HR;
import com.example.demo.entities.SuperHR;
import com.example.demo.service.SuperHRService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class SuperHRController {

    @Autowired
    private SuperHRService superHRService;

    @PostMapping("/register/superhr")
    public SuperHR registerSuperHR(@RequestBody SuperHR superHR) {
        return superHRService.registerSuperHR(superHR);
    }
    
    
    @PostMapping("/login/superhr")
    public String loginEmployee(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        SuperHR shr = superHRService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());

        if (shr != null) {
            HttpSession session = request.getSession(true); 
            session.setAttribute("user", shr); 
            return "Login successful!";
        } else {
            return "Invalid email or password";
        }
    }

    @GetMapping("/session/superhr")
    public String checkSession(HttpSession session) {
        SuperHR user = (SuperHR) session.getAttribute("user");
        if (user != null) {
            return "User is logged in: " + user.getEmail();
        } else {
            return "No active session found";
        }
    }

    @GetMapping("/logout/superhr")
    public String logout(HttpSession session) {
        session.invalidate(); 
        return "Logged out successfully";
    }

    @GetMapping("/superhr/{email}")
    public SuperHR getHRByEmail(@PathVariable String email, HttpSession session) {
        HR user = (HR) session.getAttribute("user");
        if (user != null) {
            return superHRService.getSuperHRByEmail(email);
        } else {
            return null; 
        }
    }
   
    

}