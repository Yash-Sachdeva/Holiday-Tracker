package com.example.demo.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Holiday;
import com.example.demo.services.HolidayService;

@RestController
@RequestMapping("/holiday")
public class HolidayController {
	
	@Autowired
	HolidayService holidayService;
	
	@GetMapping("/all")
	public List<Holiday> getAllHolidays(){
		return holidayService.getHolidays();		
	}
	
	@PostMapping("/add")
	public Holiday registerHoliday(@RequestBody Holiday holiday) {
		return holidayService.registerHoliday(holiday);
	}
	
	
	@GetMapping("/holidayid")
    public Long getHolidayId(@RequestParam String clientName, @RequestParam LocalDate holidayDate) {
        return holidayService.getHolidayId(clientName, holidayDate);
    }
	
	@PutMapping("/update/{holidayId}")
	public Holiday updateHoliday(@PathVariable Long holidayId, @RequestBody Holiday holiday) {
		return holidayService.updateHoliday(holidayId,holiday);
	}
	
	
	@GetMapping("/get/{clientName}")
	public List<Holiday> getHolidayWithClientName(@PathVariable String clientName ) {
		return holidayService.getHolidayWithClientName(clientName);
	}
	
}
