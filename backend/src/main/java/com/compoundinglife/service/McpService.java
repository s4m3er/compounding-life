package com.compoundinglife.service;

import com.compoundinglife.model.McpModels.*;
import com.compoundinglife.model.ProtectionModels.*;
import com.compoundinglife.model.SipModels.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class McpService {

    private final FinanceCalculationService financeService;
    private final WisdomService wisdomService;
    private final HabitService habitService;

    public McpService(FinanceCalculationService financeService,
                      WisdomService wisdomService,
                      HabitService habitService) {
        this.financeService = financeService;
        this.wisdomService = wisdomService;
        this.habitService = habitService;
    }

    public List<McpToolInfo> listTools() {
        List<McpToolInfo> tools = new ArrayList<>();

        tools.add(McpToolInfo.builder()
                .name("calculate_sip")
                .description("Calculates SIP compounding with optional annual step-up and inflation adjustment over tenure years.")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "monthlyInvestment", Map.of("type", "number", "description", "Monthly SIP amount"),
                                "expectedAnnualReturnRate", Map.of("type", "number", "description", "Expected annual return percentage, e.g. 12.0"),
                                "tenureYears", Map.of("type", "integer", "description", "Tenure in years, e.g. 15 or 25"),
                                "annualStepUpPercentage", Map.of("type", "number", "description", "Annual percentage increase in SIP, e.g. 10.0")
                        ),
                        "required", List.of("monthlyInvestment", "expectedAnnualReturnRate", "tenureYears")
                ))
                .build());

        tools.add(McpToolInfo.builder()
                .name("calculate_emergency_fund")
                .description("Calculates emergency fund requirements and 3-tier liquid allocation using Munger's Inversion principle.")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "monthlyLivingExpenses", Map.of("type", "number", "description", "Monthly mandatory living expenses"),
                                "dependentCount", Map.of("type", "integer", "description", "Number of financial dependents"),
                                "employmentType", Map.of("type", "string", "enum", List.of("STABLE_SALARY", "COMMISSION_BASED", "FREELANCER", "BUSINESS_OWNER"))
                        ),
                        "required", List.of("monthlyLivingExpenses")
                ))
                .build());

        tools.add(McpToolInfo.builder()
                .name("calculate_insurance_needs")
                .description("Estimates pure term life insurance and base + super top-up health insurance coverage.")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "annualIncome", Map.of("type", "number", "description", "Current annual income"),
                                "totalOutstandingDebts", Map.of("type", "number", "description", "Total outstanding loans / liabilities"),
                                "age", Map.of("type", "integer", "description", "Current age in years"),
                                "cityTier", Map.of("type", "string", "enum", List.of("METRO", "TIER_1", "TIER_2_OR_3"))
                        ),
                        "required", List.of("annualIncome", "age")
                ))
                .build());

        tools.add(McpToolInfo.builder()
                .name("get_wisdom_quote")
                .description("Fetches a timeless mental model or quote from Buffett, Munger, Graham, Parag Parikh, or InvestYadnya.")
                .inputSchema(Map.of(
                        "type", "object",
                        "properties", Map.of(
                                "master", Map.of("type", "string", "description", "Master name or leave empty for random")
                        )
                ))
                .build());

        return tools;
    }

    public McpCallResponse executeTool(McpCallRequest request) {
        String tool = request.getToolName();
        Map<String, Object> args = request.getArguments() != null ? request.getArguments() : Map.of();

        try {
            switch (tool) {
                case "calculate_sip": {
                    double monthly = ((Number) args.getOrDefault("monthlyInvestment", 10000)).doubleValue();
                    double rate = ((Number) args.getOrDefault("expectedAnnualReturnRate", 12.0)).doubleValue();
                    int tenure = ((Number) args.getOrDefault("tenureYears", 20)).intValue();
                    double stepUp = ((Number) args.getOrDefault("annualStepUpPercentage", 0.0)).doubleValue();

                    SipCalculationResponse res = financeService.calculateSip(SipCalculationRequest.builder()
                            .monthlyInvestment(monthly)
                            .expectedAnnualReturnRate(rate)
                            .tenureYears(tenure)
                            .annualStepUpPercentage(stepUp)
                            .inflationRate(6.0)
                            .build());
                    return McpCallResponse.builder().toolName(tool).result(res).success(true).build();
                }
                case "calculate_emergency_fund": {
                    double burn = ((Number) args.getOrDefault("monthlyLivingExpenses", 50000)).doubleValue();
                    int dependents = ((Number) args.getOrDefault("dependentCount", 1)).intValue();
                    String employment = (String) args.getOrDefault("employmentType", "STABLE_SALARY");

                    EmergencyFundResponse res = financeService.calculateEmergencyFund(EmergencyFundRequest.builder()
                            .monthlyLivingExpenses(burn)
                            .dependentCount(dependents)
                            .employmentType(employment)
                            .build());
                    return McpCallResponse.builder().toolName(tool).result(res).success(true).build();
                }
                case "calculate_insurance_needs": {
                    double income = ((Number) args.getOrDefault("annualIncome", 1200000)).doubleValue();
                    double debt = ((Number) args.getOrDefault("totalOutstandingDebts", 0)).doubleValue();
                    int age = ((Number) args.getOrDefault("age", 30)).intValue();
                    String city = (String) args.getOrDefault("cityTier", "METRO");

                    InsuranceResponse res = financeService.calculateInsuranceNeeds(InsuranceRequest.builder()
                            .annualIncome(income)
                            .totalOutstandingDebts(debt)
                            .existingLiquidAssets(0)
                            .age(age)
                            .dependentsCount(2)
                            .cityTier(city)
                            .build());
                    return McpCallResponse.builder().toolName(tool).result(res).success(true).build();
                }
                case "get_wisdom_quote": {
                    String master = (String) args.get("master");
                    Object quote = (master != null && !master.isBlank())
                            ? wisdomService.getQuotesByMaster(master)
                            : wisdomService.getRandomQuote();
                    return McpCallResponse.builder().toolName(tool).result(quote).success(true).build();
                }
                default:
                    return McpCallResponse.builder()
                            .toolName(tool)
                            .success(false)
                            .errorMessage("Unknown MCP tool: " + tool)
                            .build();
            }
        } catch (Exception e) {
            return McpCallResponse.builder()
                    .toolName(tool)
                    .success(false)
                    .errorMessage("Error executing MCP tool: " + e.getMessage())
                    .build();
        }
    }
}
