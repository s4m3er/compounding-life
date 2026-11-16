package com.compoundinglife.controller;

import com.compoundinglife.model.ProtectionModels.*;
import com.compoundinglife.model.SipModels.*;
import com.compoundinglife.service.FinanceCalculationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final FinanceCalculationService financeService;

    public FinanceController(FinanceCalculationService financeService) {
        this.financeService = financeService;
    }

    @PostMapping("/sip")
    public ResponseEntity<SipCalculationResponse> calculateSip(@RequestBody SipCalculationRequest request) {
        return ResponseEntity.ok(financeService.calculateSip(request));
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
