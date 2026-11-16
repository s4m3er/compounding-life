package com.compoundinglife.controller;

import com.compoundinglife.event.DomainEvents.PortfolioCalculatedEvent;
import com.compoundinglife.model.ProtectionModels.*;
import com.compoundinglife.model.SipModels.*;
import com.compoundinglife.service.EventProducerService;
import com.compoundinglife.service.FinanceCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final FinanceCalculationService financeService;
    private final EventProducerService eventProducer;

    public FinanceController(FinanceCalculationService financeService,
                             EventProducerService eventProducer) {
        this.financeService = financeService;
        this.eventProducer = eventProducer;
    }

    @PostMapping("/sip")
    public ResponseEntity<SipCalculationResponse> calculateSip(@RequestBody SipCalculationRequest request) {
        SipCalculationResponse response = financeService.calculateSip(request);

        // Emit event to Kafka event-driven pipeline
        eventProducer.publishPortfolioEvent(PortfolioCalculatedEvent.builder()
                .eventType("SIP_CALCULATED")
                .monthlySip(request.getMonthlyInvestment())
                .returnRate(request.getExpectedAnnualReturnRate())
                .tenureYears(request.getTenureYears())
                .projectedWealth(response.getTotalWealthNominal())
                .build());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/emergency-fund")
    public ResponseEntity<EmergencyFundResponse> calculateEmergencyFund(@RequestBody EmergencyFundRequest request) {
        return ResponseEntity.ok(financeService.calculateEmergencyFund(request));
    }

    @PostMapping("/insurance")
    public ResponseEntity<InsuranceResponse> calculateInsurance(@RequestBody InsuranceRequest request) {
        return ResponseEntity.ok(financeService.calculateInsuranceNeeds(request));
    }
}
