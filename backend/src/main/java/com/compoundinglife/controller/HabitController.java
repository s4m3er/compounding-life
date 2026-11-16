package com.compoundinglife.controller;

import com.compoundinglife.model.WisdomModels.DailyHabitItem;
import com.compoundinglife.model.WisdomModels.LongevityScoreResponse;
import com.compoundinglife.service.HabitService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {

    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @GetMapping("/checklist")
    public ResponseEntity<List<DailyHabitItem>> getChecklist() {
        return ResponseEntity.ok(habitService.getDefaultHabitChecklist());
    }

    @PostMapping("/evaluate")
    public ResponseEntity<LongevityScoreResponse> evaluateScore(@RequestBody List<DailyHabitItem> habits) {
        return ResponseEntity.ok(habitService.evaluateScore(habits));
    }
}
