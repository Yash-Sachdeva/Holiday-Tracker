package com.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Admin;
import com.example.demo.entities.Client;
import com.example.demo.entities.Employee;
import com.example.demo.entities.HR;
import com.example.demo.dto.LoginDTO;
import com.example.demo.service.AdminService;
import com.example.demo.service.ClientService;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.HRService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/auth/admin")
public class AdminController {
	
	@Autowired
	private EmployeeService employeeService;
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private HRService hrService;
    
    @Autowired
    private ClientService clientService;
    
    // Admin Authentication APIs
    
    @PostMapping("/login")
    public ResponseEntity<String> loginAdmin(@RequestBody LoginDTO loginDTO, HttpServletRequest request) {
        Admin admin = adminService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }
        HttpSession session = request.getSession(true);
        session.setAttribute("userAdmin", admin);
        
        return ResponseEntity.ok("Admin login successful!");
    }
    
    @GetMapping("/session")
    public ResponseEntity<String> checkSession(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active admin session found");
        }
        return ResponseEntity.ok("Admin is logged in: " + admin.getEmail());
    }
    
    @GetMapping("/logout")
    public ResponseEntity<String> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Admin logged out successfully");
    }
    
    // Dashboard Stats APIs
    
    @GetMapping("/dashboard/total-hrs")
    public ResponseEntity<?> getTotalHRs(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        List<HR> allHRs = hrService.getAllHR();
        int totalHRs = allHRs.size();
        return ResponseEntity.ok(totalHRs);
    }
    
    @GetMapping("/dashboard/total-clients")
    public ResponseEntity<?> getTotalClients(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        List<Client> allClients = clientService.getClients();
        int totalClients = allClients.size();
        return ResponseEntity.ok(totalClients);
    }
    
    @GetMapping("/dashboard/total-employees")
    public ResponseEntity<?> getTotalEmployees(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        try {
            List<Employee> allEmployees = employeeService.getAllEmployees();
            int totalEmployees = allEmployees.size();
            return ResponseEntity.ok(totalEmployees);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving employees: " + e.getMessage());
        }
    }
    
    // HR Management APIs
    
    @GetMapping("/hrs")
    public ResponseEntity<?> getAllHRs(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        List<HR> hrs = hrService.getAllHR();
        return ResponseEntity.ok(hrs);
    }
    
    @GetMapping("/hrs/{id}")
    public ResponseEntity<?> getHRById(@PathVariable Long id, HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        HR hr = hrService.getHrById(id);
        if (hr == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("HR not found");
        }
        return ResponseEntity.ok(hr);
    }
    
    @PostMapping("/hrs")
    public ResponseEntity<?> addHR(@RequestBody HR hr, HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        HR savedHR = hrService.registerHR(hr);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHR);
    }
    
    @PutMapping("/update/hr")
    public ResponseEntity<String> updateEmployee(HttpSession session, @RequestBody HR e) {
        Admin admin = (Admin)session.getAttribute("userAdmin");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have authorization to update an HR");
        }

        hrService.registerHR(e);
        return ResponseEntity.ok("HR Updated Successfully");
    }
    
    @DeleteMapping("/delete/hr")
    public ResponseEntity<String> deleteHR(HttpSession session,@RequestBody HR e){
    	Admin user = (Admin) session.getAttribute("userAdmin");
        
        if (user == null || !user.getRole().equals("Admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return ResponseEntity.ok(hrService.deleteHR(e));
    }
    
    // Client Management APIs
    
    @GetMapping("/clients")
    public ResponseEntity<?> getAllClients(HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        List<Client> clients = clientService.getClients();
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/clients/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id, HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        Client client = clientService.getClientById(id);
        if (client == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }
        return ResponseEntity.ok(client);
    }
    
    @PostMapping("/clients")
    public ResponseEntity<?> addClient(@RequestBody Client client, HttpSession session) {
        Admin admin = (Admin) session.getAttribute("userAdmin");
        if (admin == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authorized as admin");
        }
        
        Client savedClient = clientService.registerClient(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClient);
    }
    
    @PutMapping("/update/client")
    public ResponseEntity<String> updateClient(HttpSession session, @RequestBody Client e) {
        Admin admin = (Admin)session.getAttribute("userAdmin");
        if (admin == null || !"ADMIN".equalsIgnoreCase(admin.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have authorization to update an HR");
        }

        clientService.registerClient(e);
        return ResponseEntity.ok("Client Updated Successfully");
    }
    
    @DeleteMapping("/delete/client")
    public ResponseEntity<String> deleteClient(HttpSession session,@RequestBody Client e){
    	Admin user = (Admin) session.getAttribute("userAdmin");
        
        if (user == null || !user.getRole().equals("Admin")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        return ResponseEntity.ok(clientService.deleteClient(e));
    }
}