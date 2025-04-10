package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginDTO;
import com.example.demo.entities.HR;
import com.example.demo.service.HRService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/auth")
public class HRController {

    @Autowired
    private HRService hrService;

    @PostMapping("/register/hr")
    public HR registerHR(@RequestBody HR hr) {
        return hrService.registerHR(hr);
    }

    @PostMapping("/login/hr")
    public ResponseEntity<String> loginHR(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        HR hr = hrService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());

        if (hr != null) {
            HttpSession session = request.getSession(true);
            session.setAttribute("userHR", hr);  // Using "userHR" consistently
            session.setAttribute("role", "HR");
            return ResponseEntity.ok("Login successful!");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
    }

    @GetMapping("/session/hr")
    public ResponseEntity<String> checkSession(HttpSession session) {
        HR user = (HR) session.getAttribute("userHR");  // Using "userHR" consistently

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found");
        }
        return ResponseEntity.ok("User is logged in: " + user.getName());
    }

    @GetMapping("/logout/hr")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully");
    }
    
    @GetMapping("/all/hr")
    public List<HR> getAllHR(){
    	return hrService.getAllHR();
    }
    
}
