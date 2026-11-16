package com.compoundinglife.controller;

import com.compoundinglife.model.WisdomModels.WisdomQuote;
import com.compoundinglife.service.WisdomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wisdom")
public class WisdomController {

    private final WisdomService wisdomService;

    public WisdomController(WisdomService wisdomService) {
        this.wisdomService = wisdomService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<WisdomQuote>> getAllQuotes() {
        return ResponseEntity.ok(wisdomService.getAllQuotes());
    }

    @GetMapping("/random")
    public ResponseEntity<WisdomQuote> getRandomQuote() {
        return ResponseEntity.ok(wisdomService.getRandomQuote());
    }

    @GetMapping("/by-master")
    public ResponseEntity<List<WisdomQuote>> getByMaster(@RequestParam String master) {
        return ResponseEntity.ok(wisdomService.getQuotesByMaster(master));
    }

    @GetMapping("/by-category")
    public ResponseEntity<List<WisdomQuote>> getByCategory(@RequestParam String category) {
        return ResponseEntity.ok(wisdomService.getQuotesByCategory(category));
    }
}
