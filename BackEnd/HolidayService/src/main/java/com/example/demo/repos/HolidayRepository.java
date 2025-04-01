package com.example.demo.repos;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entities.Holiday;

public interface HolidayRepository extends JpaRepository<Holiday,Long> {
	void deleteByHolidayId(Long holidayId);
	Optional<Holiday> findByClientIdAndHolidayDate(Long clientId, LocalDate holidayDate);
	Optional<Holiday> findByClientId(Long clientId);

}
