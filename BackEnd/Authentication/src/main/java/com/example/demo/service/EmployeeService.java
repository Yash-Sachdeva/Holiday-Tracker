package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Employee;
import com.example.demo.repos.EmployeeRepository;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee registerEmployee(Employee employee) {
        // Check if employee with same email already exists
        Employee existingEmployee = employeeRepository.findByEmail(employee.getEmail().toLowerCase());
        if (existingEmployee != null) {
            throw new RuntimeException("Employee with email " + employee.getEmail() + " already exists");
        }
        
        employee.setEmail(employee.getEmail().toLowerCase());
        return employeeRepository.save(employee);
    }

    public Employee authenticate(String email, String password) {
        Employee employee = employeeRepository.findByEmail(email);
        if (employee != null && employee.getPassword().equals(password)) {
            return employee;
        }
        return null;
    }
    
    public Employee getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    public List<Employee> getAllEmployeeUnderId(Long id){
    	return employeeRepository.findAllByHrId(id);
    }
    
    public String deleteEmployee(Employee e) {
    	if(employeeRepository.findByEmail(e.getEmail())==null)
    		return "Employee Not Found";
    	else {
    		employeeRepository.delete(e);
    		return "Employee Deleted Successfully";
    	}    		
    }
}
