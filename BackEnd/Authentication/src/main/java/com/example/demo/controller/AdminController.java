package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.Admin;
import com.example.demo.entities.Client;
import com.example.demo.entities.Employee;
import com.example.demo.entities.HR;
import com.example.demo.service.AdminService;
import com.example.demo.service.ClientService;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.HRService;


import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {
	
	@Autowired
	private EmployeeService employeeService;
    
    @Autowired
    private AdminService adminService;
    
    @Autowired
    private HRService hrService;
    
    @Autowired
    private ClientService clientService;
        
    @GetMapping("/session")
    public ResponseEntity<String> checkSession(){
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        Admin admin = adminService.getAdminByEmail(auth.getName());
        return ResponseEntity.ok(admin.getEmail());
    }
    
    
    @GetMapping("/dashboard/total-hrs")
    public ResponseEntity<?> getTotalHRs() {
        List<HR> allHRs = hrService.getAllHR();
        int totalHRs = allHRs.size();
        return ResponseEntity.ok(totalHRs);
    }
    
    @GetMapping("/dashboard/total-clients")
    public ResponseEntity<?> getTotalClients() {
        List<Client> allClients = clientService.getClients();
        int totalClients = allClients.size();
        return ResponseEntity.ok(totalClients);
    }
    
    @GetMapping("/dashboard/total-employees")
    public ResponseEntity<?> getTotalEmployees() {
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
    @GetMapping("/all-hrs")
    public ResponseEntity<?> getAllHRs() {   
        List<HR> hrs = hrService.getAllHR();
        return ResponseEntity.ok(hrs);
    }
    
    @GetMapping("/hrs/{id}")
    public ResponseEntity<?> getHRById(@PathVariable Long id) {
        HR hr = hrService.getHrById(id);
        if (hr == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("HR not found");
        }
        return ResponseEntity.ok(hr);
    }
    
    @PostMapping("/register-hr")
    public ResponseEntity<?> addHR(@RequestBody HR hr) {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        Admin admin = adminService.getAdminByEmail(auth.getName());
        hr.setAdminId(admin.getAdminId());
        HR savedHR = hrService.registerHR(hr);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedHR);
    }
    
    @PutMapping("/update-hr")
    public ResponseEntity<String> updateEmployee(@RequestBody HR e) {
        hrService.registerHR(e);
        return ResponseEntity.ok("HR Updated Successfully");
    }
    
    @DeleteMapping("/delete-hr")
    public ResponseEntity<String> deleteHR(@RequestBody HR e){
        return ResponseEntity.ok(hrService.deleteHR(e));
    }
    
    // Client Management APIs
    @GetMapping("/clients")
    public ResponseEntity<?> getAllClients() {
        List<Client> clients = clientService.getClients();
        return ResponseEntity.ok(clients);
    }
    
    @GetMapping("/clients/{id}")
    public ResponseEntity<?> getClientById(@PathVariable Long id) {
        Client client = clientService.getClientById(id);
        if (client == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Client not found");
        }
        return ResponseEntity.ok(client);
    }
    
    @PostMapping("/add-client")
    public ResponseEntity<?> addClient(@RequestBody Client client) {
        Client savedClient = clientService.registerClient(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedClient);
    }
    
    @PutMapping("/update-client")
    public ResponseEntity<String> updateClient( @RequestBody Client e) {
        clientService.registerClient(e);
        return ResponseEntity.ok("Client Updated Successfully");
    }
    
    @DeleteMapping("/delete-client")
    public ResponseEntity<String> deleteClient(@RequestBody Client e){
        return ResponseEntity.ok(clientService.deleteClient(e));
    }
}