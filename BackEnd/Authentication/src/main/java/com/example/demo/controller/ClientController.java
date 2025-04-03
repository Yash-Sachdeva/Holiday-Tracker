package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Client;
import com.example.demo.service.ClientService;

@RestController
@RequestMapping("/auth")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @PostMapping("/register/client")
    public Client registerClient(@RequestBody Client client) {
        return clientService.registerClient(client);
    }
    @GetMapping("client/all")
    public List<Client> getClients()
    {
    	return clientService.getClients();
    }
}