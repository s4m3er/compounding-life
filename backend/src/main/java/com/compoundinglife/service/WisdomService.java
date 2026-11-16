package com.compoundinglife.service;

import com.compoundinglife.entity.WisdomEntity;
import com.compoundinglife.model.WisdomModels.WisdomQuote;
import com.compoundinglife.repository.WisdomEntityRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
public class WisdomService {

    private final WisdomEntityRepository repository;

    public WisdomService(WisdomEntityRepository repository) {
        this.repository = repository;
    }

    public List<WisdomQuote> getAllQuotes() {
        List<WisdomEntity> entities = repository.findAll();
        if (entities.isEmpty()) {
            return getDefaultFallbackQuotes();
        }
        return entities.stream().map(this::mapToQuote).collect(Collectors.toList());
    }

    public List<WisdomQuote> getQuotesByMaster(String master) {
        return repository.findByMasterIgnoreCase(master).stream()
                .map(this::mapToQuote)
                .collect(Collectors.toList());
    }

    public List<WisdomQuote> getQuotesByCategory(String category) {
        return repository.findByCategoryIgnoreCase(category).stream()
                .map(this::mapToQuote)
                .collect(Collectors.toList());
    }

    public WisdomQuote getRandomQuote() {
        List<WisdomQuote> all = getAllQuotes();
        int index = ThreadLocalRandom.current().nextInt(all.size());
        return all.get(index);
    }

    private WisdomQuote mapToQuote(WisdomEntity e) {
        return WisdomQuote.builder()
                .id(String.valueOf(e.getId()))
                .master(e.getMaster())
                .category(e.getCategory())
                .quote(e.getQuote())
                .practicalApplication(e.getPracticalApplication())
                .referenceWork(e.getReferenceWork())
                .build();
    }

    private List<WisdomQuote> getDefaultFallbackQuotes() {
        return List.of(
                WisdomQuote.builder()
                        .id("1")
                        .master("Charlie Munger")
                        .category("INVERSION")
                        .quote("Invert, always invert.")
                        .practicalApplication("Avoid ruin and stupidity.")
                        .referenceWork("Poor Charlie's Almanack")
                        .build()
        );
    }
}
