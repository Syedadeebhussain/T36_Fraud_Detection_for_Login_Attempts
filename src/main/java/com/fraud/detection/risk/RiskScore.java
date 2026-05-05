package com.fraud.detection.risk;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RiskScore {
    private int score;
    private List<String> reasons;

    public void add(int value, String reason) {
        this.score += value;
        this.reasons.add(reason);
    }
}
