package com.example.demo.repos;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);   
}
