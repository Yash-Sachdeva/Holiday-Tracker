package com.example.demo.services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Holiday;
import com.example.demo.repos.HolidayRepository;

@Service
public class HolidayService {
	
	@Autowired
	private HolidayRepository holidayRepository;
	
	public Holiday registerHoliday(Holiday holiday) {
		return holidayRepository.save(holiday);
	}
	
	public List<Holiday> getHolidays(){
		return holidayRepository.findAll();
	}
	
	public List<Holiday> getClientHolidays(Long clientId){
		return holidayRepository.findByClientId(clientId);
	}
	
    public Long getHolidayId(Long clientId, LocalDate holidayDate) {
        Optional<Holiday> holiday = holidayRepository.findByClientIdAndHolidayDate(clientId, holidayDate);
        return holiday.map(Holiday::getHolidayId).orElse(null);
    }
	
	public void deleteHoliday(Long holidayId) {
		if (holidayRepository.existsById(holidayId)) {
			holidayRepository.deleteById(holidayId);
		} else {
			throw new RuntimeException("Holiday with ID " + holidayId + " not found.");
	    }

	}
	
	public Holiday updateHoliday(Long holidayId, Holiday updatedHoliday) {
	    return holidayRepository.findById(holidayId)
	        .map(existingHoliday -> {
	            existingHoliday.setHolidayDate(updatedHoliday.getHolidayDate());
	            existingHoliday.setDescription(updatedHoliday.getDescription());
	            return holidayRepository.save(existingHoliday); 
	        })
	        .orElseThrow(() -> new RuntimeException("Holiday with ID " + holidayId + " not found."));
	}


}
