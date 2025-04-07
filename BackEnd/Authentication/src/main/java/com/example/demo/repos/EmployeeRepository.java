package com.example.demo.repos;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByEmail(String email);   
    Optional<Employee> findById(Long id);
    List<Employee> findAllByHrId(Long id);
    List<Employee> findAll();
}
