package com.compoundinglife.config;

import com.compoundinglife.entity.User;
import com.compoundinglife.entity.WisdomEntity;
import com.compoundinglife.repository.UserRepository;
import com.compoundinglife.repository.WisdomEntityRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository,
                                          WisdomEntityRepository wisdomRepository,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed Default Admin User if absent
            if (!userRepository.existsByEmail("admin@compoundinglife.com")) {
                userRepository.save(User.builder()
                        .email("admin@compoundinglife.com")
                        .password(passwordEncoder.encode("Admin@123"))
                        .fullName("Chief Rationality Officer")
                        .role("ROLE_ADMIN")
                        .build());
            }

            // Seed Sample Regular User if absent
            if (!userRepository.existsByEmail("investor@compoundinglife.com")) {
                userRepository.save(User.builder()
                        .email("investor@compoundinglife.com")
                        .password(passwordEncoder.encode("Investor@123"))
                        .fullName("Disciplined Compounder")
                        .role("ROLE_USER")
                        .build());
            }

            // Seed Wisdom items if empty
            if (wisdomRepository.count() == 0) {
                wisdomRepository.saveAll(List.of(
                        WisdomEntity.builder()
                                .master("Charlie Munger")
                                .category("INVERSION")
                                .quote("Invert, always invert: Turn a situation or problem upside down. What happens if we do the exact opposite? What do we want to avoid?")
                                .practicalApplication("To be wealthy: avoid foolish speculation, high debt, and trading. To be healthy: avoid smoking, sleeplessness, and processed sugar.")
                                .referenceWork("Poor Charlie's Almanack")
                                .build(),
                        WisdomEntity.builder()
                                .master("Charlie Munger")
                                .category("BORING_COMPOUNDING")
                                .quote("The big money is not in the buying and the selling, but in the waiting.")
                                .practicalApplication("Do not check your portfolio every day. Compounding is like watching grass grow.")
                                .referenceWork("Wesco Financial Annual Meeting")
                                .build(),
                        WisdomEntity.builder()
                                .master("Warren Buffett")
                                .category("FRUGALITY")
                                .quote("Do not save what is left after spending, but spend what is left after saving.")
                                .practicalApplication("Automate your SIP deduction on the day your salary lands.")
                                .referenceWork("Berkshire Hathaway Letters")
                                .build(),
                        WisdomEntity.builder()
                                .master("Benjamin Graham")
                                .category("BEHAVIORAL_BIAS")
                                .quote("The investor's chief problem—and even his worst enemy—is likely to be himself.")
                                .practicalApplication("Market crashes are not disasters; they are sales for disciplined savers.")
                                .referenceWork("The Intelligent Investor")
                                .build(),
                        WisdomEntity.builder()
                                .master("Parag Parikh")
                                .category("BEHAVIORAL_BIAS")
                                .quote("Loss aversion is the strongest human emotion. The pain of losing $100 is twice as intense as the joy of making $100.")
                                .practicalApplication("Recognize your internal bias. When markets fall 15-20%, do not panic sell.")
                                .referenceWork("Stocks to Riches")
                                .build(),
                        WisdomEntity.builder()
                                .master("InvestYadnya")
                                .category("INVERSION")
                                .quote("Before you invest your first rupee in the stock market, you must have an adequate emergency fund and pure term insurance.")
                                .practicalApplication("Investing without insurance is like racing a car without brakes or seatbelts.")
                                .referenceWork("Financial Planning 101")
                                .build(),
                        WisdomEntity.builder()
                                .master("Stoic & Health")
                                .category("HEALTH_LONGEVITY")
                                .quote("A healthy person wants a thousand things; a sick person wants only one.")
                                .practicalApplication("Sleep 7-8 hours, walk 10,000 steps daily. Health is the multiplier of all wealth.")
                                .referenceWork("Timeless Health Principles")
                                .build()
                ));
            }
        };
    }
}
