package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Employee;
import com.example.demo.entities.HR;
import com.example.demo.service.EmployeeService;
import com.example.demo.service.HRService;

@RestController
@RequestMapping("/hr")
public class HRController {

    @Autowired
    private HRService hrService;
    
    @Autowired EmployeeService employeeService;
    
    @PostMapping("/register")
    public HR registerHR(@RequestBody HR hr) {
        return hrService.registerHR(hr);
    }


    @GetMapping("/session")
    public ResponseEntity<String> checkSession() {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HR hr = hrService.getHRByEmail(auth.getName());
        if (hr == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found");
        }
        return ResponseEntity.ok(hr.getName()+auth.getAuthorities());
    }

    
    @GetMapping("/all-hrs")
    public List<HR> getAllHR(){
    	return hrService.getAllHR();
    }
    
    
    //Employee CRUD
    
    @PostMapping("/register-employee")
    public ResponseEntity<String> registerEmployee(@RequestBody Employee employee) {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HR hr = hrService.getHRByEmail(auth.getName());
        employee.setHrId(hr.getHrId());
        employeeService.registerEmployee(employee);
        return ResponseEntity.ok("Employee Registered Successfully");
    }
    
    @PutMapping("/update-employee")
    public ResponseEntity<String> updateEmployee(@RequestBody Employee e) {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HR hr = hrService.getHRByEmail(auth.getName());
        if (hr.getHrId()!=e.getHrId()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have authorization to update this employee");
        }

        try {
        	e.setHrId(hr.getHrId());
            employeeService.updateEmployee(e);
            return ResponseEntity.ok("Employee Updated Successfully");
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    
    @GetMapping("/all-employee")
    public ResponseEntity<List<Employee>> getAllEmployees() {
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HR hr = hrService.getHRByEmail(auth.getName());
        return ResponseEntity.ok(employeeService.getAllEmployeeUnderId(hr.getHrId()));
    }
    
    
    @DeleteMapping("/delete-employee/{eid}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long eid){
    	Authentication auth=SecurityContextHolder.getContext().getAuthentication();
        HR hr = hrService.getHRByEmail(auth.getName());
        Employee e=employeeService.getEmployeeById(eid);
        if(e.getHrId()!=hr.getHrId())
        	return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("You do not have that authorization");
        return ResponseEntity.ok(employeeService.deleteEmployee(e));
    }
}
