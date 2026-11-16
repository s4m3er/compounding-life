package com.compoundinglife.service;

import com.compoundinglife.model.WisdomModels.WisdomQuote;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class WisdomService {

    private final List<WisdomQuote> quotes = new ArrayList<>();

    public WisdomService() {
        initializeWisdomVault();
    }

    private void initializeWisdomVault() {
        // Charlie Munger
        quotes.add(WisdomQuote.builder()
                .id("munger-1")
                .master("Charlie Munger")
                .category("INVERSION")
                .quote("Invert, always invert: Turn a situation or problem upside down. What happens if we do the exact opposite? What do we want to avoid?")
                .practicalApplication("To be wealthy: avoid foolish speculation, high debt, and trading. To be healthy: avoid smoking, sleeplessness, and processed sugar.")
                .referenceWork("Poor Charlie's Almanack")
                .build());

        quotes.add(WisdomQuote.builder()
                .id("munger-2")
                .master("Charlie Munger")
                .category("BORING_COMPOUNDING")
                .quote("The big money is not in the buying and the selling, but in the waiting.")
                .practicalApplication("Do not check your portfolio every day. Compounding is like watching grass grow. Constant tinkering destroys capital through taxes and emotional errors.")
                .referenceWork("Wesco Financial Annual Meeting")
                .build());

        // Warren Buffett
        quotes.add(WisdomQuote.builder()
                .id("buffett-1")
                .master("Warren Buffett")
                .category("FRUGALITY")
                .quote("Do not save what is left after spending, but spend what is left after saving.")
                .practicalApplication("Automate your SIP deduction on the day your salary lands. What you don't see in your spending account, you will not waste.")
                .referenceWork("Berkshire Hathaway Letters")
                .build());

        quotes.add(WisdomQuote.builder()
                .id("buffett-2")
                .master("Warren Buffett")
                .category("BORING_COMPOUNDING")
                .quote("Someone's sitting in the shade today because someone planted a tree a long time ago.")
                .practicalApplication("Invest for your 50-year-old self today. Small continuous amounts compound into multi-crore peace of mind.")
                .referenceWork("Berkshire Hathaway Shareholder Letter")
                .build());

        // Benjamin Graham
        quotes.add(WisdomQuote.builder()
                .id("graham-1")
                .master("Benjamin Graham")
                .category("BEHAVIORAL_BIAS")
                .quote("The investor's chief problem—and even his worst enemy—is likely to be himself.")
                .practicalApplication("Market crashes are not disasters; they are sales for disciplined savers. Keep your emotions completely detached from market volatility.")
                .referenceWork("The Intelligent Investor")
                .build());

        // Parag Parikh
        quotes.add(WisdomQuote.builder()
                .id("parag-parikh-1")
                .master("Parag Parikh")
                .category("BEHAVIORAL_BIAS")
                .quote("Loss aversion is the strongest human emotion. The pain of losing $100 is twice as intense as the joy of making $100.")
                .practicalApplication("Recognize your internal bias. When markets fall 15-20%, do not panic sell. Panic selling converts temporary paper drawdowns into permanent capital loss.")
                .referenceWork("Stocks to Riches: Insights on Investor Behaviour")
                .build());

        quotes.add(WisdomQuote.builder()
                .id("parag-parikh-2")
                .master("Parag Parikh")
                .category("FRUGALITY")
                .quote("True wealth is not about what you display on the outside. It is the freedom to choose how you spend your time.")
                .practicalApplication("Resist the urge to buy depreciating assets (expensive cars, luxury gadgets) to impress people who don't care about you.")
                .referenceWork("Value Investing and Behavioral Finance")
                .build());

        // InvestYadnya
        quotes.add(WisdomQuote.builder()
                .id("investyadnya-1")
                .master("InvestYadnya")
                .category("BORING_COMPOUNDING")
                .quote("Asset allocation is responsible for more than 90% of your long-term portfolio returns, not individual stock picking.")
                .practicalApplication("Maintain a simple, disciplined allocation across Equity (Index/Flexicap), Debt (Emergency/FD), and Gold. Rebalance once a year.")
                .referenceWork("InvestYadnya Financial Planning Principles")
                .build());

        quotes.add(WisdomQuote.builder()
                .id("investyadnya-2")
                .master("InvestYadnya")
                .category("INVERSION")
                .quote("Before you invest your first rupee in the stock market, you must have an adequate emergency fund and pure term insurance.")
                .practicalApplication("Investing without insurance is like driving a race car without brakes or a seatbelt. One medical emergency can wipe out years of savings.")
                .referenceWork("Financial Planning 101")
                .build());

        // Health & Longevity
        quotes.add(WisdomQuote.builder()
                .id("longevity-1")
                .master("Stoic & Health")
                .category("HEALTH_LONGEVITY")
                .quote("A healthy person wants a thousand things; a sick person wants only one.")
                .practicalApplication("Sleep 7-8 hours, walk 10,000 steps daily, drink clean water, and lift something heavy twice a week. Health is the multiplier of all wealth.")
                .referenceWork("Timeless Health Principles")
                .build());

        quotes.add(WisdomQuote.builder()
                .id("longevity-2")
                .master("Stoic & Health")
                .category("HEALTH_LONGEVITY")
                .quote("Stress is the silent compound interest that destroys your arteries and immune system.")
                .practicalApplication("Practice financial frugality to eliminate debt anxiety. The ultimate luxury is sleeping soundly with zero financial stress.")
                .referenceWork("Mind-Body Longevity Foundations")
                .build());
    }

    public List<WisdomQuote> getAllQuotes() {
        return quotes;
    }

    public List<WisdomQuote> getQuotesByMaster(String master) {
        return quotes.stream()
                .filter(q -> q.getMaster().equalsIgnoreCase(master))
                .collect(Collectors.toList());
    }

    public List<WisdomQuote> getQuotesByCategory(String category) {
        return quotes.stream()
                .filter(q -> q.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public WisdomQuote getRandomQuote() {
        int index = ThreadLocalRandom.current().nextInt(quotes.size());
        return quotes.get(index);
    }
}
