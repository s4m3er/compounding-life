package com.compoundinglife.service;

import com.compoundinglife.model.WisdomModels.DailyHabitItem;
import com.compoundinglife.model.WisdomModels.LongevityScoreResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HabitService {

    public List<DailyHabitItem> getDefaultHabitChecklist() {
        List<DailyHabitItem> habits = new ArrayList<>();

        // HEALTH PILLAR
        habits.add(DailyHabitItem.builder()
                .id("h-sleep")
                .pillar("HEALTH")
                .title("7+ Hours Quality Sleep")
                .description("No screens 45 mins before bed. Sleep repairs DNA and clears brain metabolites.")
                .completed(false)
                .impactScore(10)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("h-steps")
                .pillar("HEALTH")
                .title("8,000–10,000 Steps Walked")
                .description("Brisk walking compounds cardiovascular longevity and lowers insulin resistance.")
                .completed(false)
                .impactScore(8)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("h-food")
                .pillar("HEALTH")
                .title("Real Whole Foods (Low Sugar)")
                .description("Home-cooked meals, adequate protein and greens, zero ultra-processed sugar.")
                .completed(false)
                .impactScore(9)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("h-inversion")
                .pillar("HEALTH")
                .title("Health Inversion: Avoid Poison")
                .description("Zero smoking, no binge alcohol, mindful breathwork during daytime stress.")
                .completed(false)
                .impactScore(10)
                .build());

        // WEALTH PILLAR
        habits.add(DailyHabitItem.builder()
                .id("w-frugal")
                .pillar("WEALTH")
                .title("Conscious Frugality (No Impulse Purchases)")
                .description("Applied the 24-hour waiting rule for non-essential purchases today.")
                .completed(false)
                .impactScore(8)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("w-sip")
                .pillar("WEALTH")
                .title("Automated Compounding (SIP Shield)")
                .description("Monthly SIP is automated and untouched. No tinkering or trying to time the market.")
                .completed(false)
                .impactScore(10)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("w-noise")
                .pillar("WEALTH")
                .title("Ignored Market & Geopolitics Noise")
                .description("Did not check stock ticker fluctuations or panic over media doom-and-gloom.")
                .completed(false)
                .impactScore(9)
                .build());

        habits.add(DailyHabitItem.builder()
                .id("w-inversion")
                .pillar("WEALTH")
                .title("Wealth Inversion: Avoid Catastrophe")
                .description("Zero F&O trading, zero credit card roll-overs, zero 'quick money' tips.")
                .completed(false)
                .impactScore(10)
                .build());

        return habits;
    }

    public LongevityScoreResponse evaluateScore(List<DailyHabitItem> submittedHabits) {
        if (submittedHabits == null || submittedHabits.isEmpty()) {
            submittedHabits = getDefaultHabitChecklist();
        }

        int maxPoints = submittedHabits.stream().mapToInt(DailyHabitItem::getImpactScore).sum();
        int earnedPoints = submittedHabits.stream()
                .filter(DailyHabitItem::isCompleted)
                .mapToInt(DailyHabitItem::getImpactScore)
                .sum();

        int percentage = (int) Math.round(((double) earnedPoints / (double) maxPoints) * 100.0);

        String status;
        List<String> recs = new ArrayList<>();

        if (percentage >= 80) {
            status = "Bulletproof Compounding";
            recs.add("You are on track to live a long, peaceful, financially independent life.");
            recs.add("Keep doing the boring basics consistently. Let time do the heavy lifting.");
        } else if (percentage >= 50) {
            status = "Steadily Building";
            recs.add("Good foundation, but watch out for small leaks in sleep or impulse spending.");
            recs.add("Remember Munger's rule: It's remarkably easier to avoid stupidity than to seek brilliance.");
        } else {
            status = "Vulnerable to Shocks";
            recs.add("Focus on sleep and emergency fund first. Without these two shields, any external shock destabilizes your life.");
            recs.add("Cut out ultra-processed food and non-essential debt immediately.");
        }

        return LongevityScoreResponse.builder()
                .totalScore(percentage)
                .status(status)
                .primaryRecommendations(recs)
                .dailyMantra("Health + Wealth = Freedom to spend your time however you choose.")
                .build();
    }
}
