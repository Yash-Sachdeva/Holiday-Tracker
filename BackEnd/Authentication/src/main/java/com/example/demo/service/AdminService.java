package com.example.demo.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.Admin;
import com.example.demo.repos.AdminRepository;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;
    
    public Admin registerAdmin(Admin admin) {
        admin.setEmail(admin.getEmail().toLowerCase());
        return adminRepository.save(admin);
    }
    
    public Admin authenticate(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }
    
    public Admin getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
    
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
    
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id).orElse(null);
    }
    
    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
    
    public boolean deleteAdmin(Long id) {
        if (adminRepository.existsById(id)) {
            adminRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean deleteAdmin(Admin admin) {
        Admin existingAdmin = adminRepository.findByEmail(admin.getEmail());
        if (existingAdmin == null) {
            return false;
        } else {
            adminRepository.delete(existingAdmin);
            return true;
        }
    }
}